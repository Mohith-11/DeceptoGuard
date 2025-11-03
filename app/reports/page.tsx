"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { jsPDF } from "jspdf"

type Report = {
  id: string
  date: string
  type: string
  scans: number
  threats: number
  status: "completed" | "processing"
}

const mockReports: Report[] = [
  {
    id: "1",
    date: "2025-03-10",
    type: "Daily Summary",
    scans: 45,
    threats: 7,
    status: "completed",
  },
  {
    id: "2",
    date: "2025-03-09",
    type: "Daily Summary",
    scans: 38,
    threats: 5,
    status: "completed",
  },
  {
    id: "3",
    date: "2025-03-08",
    type: "Weekly Report",
    scans: 287,
    threats: 34,
    status: "completed",
  },
  {
    id: "4",
    date: "2025-03-07",
    type: "Daily Summary",
    scans: 52,
    threats: 9,
    status: "completed",
  },
  {
    id: "5",
    date: "2025-03-06",
    type: "Daily Summary",
    scans: 41,
    threats: 6,
    status: "completed",
  },
]

function phishingDetailsSummary(report: Report) {
  // Short, CSV-friendly summary
  return `${report.threats} threat(s) detected. Indicators checked: subdomain brand impersonation, lookalike domains, non-HTTPS, punycode, "@" in URL, IP hosts, excessive subdomains, long hostnames, suspicious keywords.`
}

function phishingDetailsLines(report: Report) {
  // Multi-line detail for PDFs
  return [
    `Phishing Details`,
    `- Threats detected: ${report.threats}`,
    `- Indicators checked:`,
    `  • Subdomain brand impersonation (e.g., "paypal.example.com.secure-login.example.com")`,
    `  • Lookalike domains using brand names in subdomains`,
    `  • Non-HTTPS links (http://) and mixed content`,
    `  • Punycode/IDN tricks (xn--...)`,
    `  • "@" present in URL path/host`,
    `  • IP-based hosts instead of domain names`,
    `  • Excessive subdomains or very long hostnames`,
    `  • Suspicious keywords like "secure-login", "verify", "update"`,
    ``,
    `Recommendations`,
    `- Verify the real apex domain (e.g., "paypal.com" not "paypal.example.com.secure-login.example.com").`,
    `- Prefer typing the address manually or using bookmarks for sensitive sites.`,
    `- Check for HTTPS and a valid certificate (padlock) before entering credentials.`,
    `- Avoid clicking unsolicited verification or security alerts via email/SMS.`,
  ]
}

function toCsvValue(val: string | number) {
  let s = String(val)
  if (s.includes('"') || s.includes(",") || s.includes("\n")) {
    s = '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

function reportsToCsv(reports: Report[]) {
  const header = ["ID", "Date", "Type", "Scans", "Threats", "Status", "Phishing Details"]
  const rows = reports.map((r) =>
    [r.id, r.date, r.type, r.scans, r.threats, r.status, phishingDetailsSummary(r)].map(toCsvValue).join(","),
  )
  return [header.join(","), ...rows].join("\n")
}

function downloadBlob(content: string | Uint8Array, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// Export a list of reports as CSV
function downloadReportsCsv(reports: Report[], filename: string) {
  const csv = reportsToCsv(reports)
  downloadBlob(csv, filename, "text/csv;charset=utf-8")
}

// Export a list of reports as a simple PDF summary
function downloadReportsPdf(reports: Report[], filename: string) {
  const doc = new jsPDF()
  let y = 12

  doc.setFontSize(16)
  doc.text("Scan Reports", 10, y)
  y += 8

  doc.setFontSize(10)
  reports.forEach((r, idx) => {
    const lines = [
      `#${idx + 1}`,
      `ID: ${r.id}`,
      `Date: ${r.date}`,
      `Type: ${r.type}`,
      `Scans: ${r.scans}`,
      `Threats: ${r.threats}`,
      `Status: ${r.status}`,
      "",
      ...phishingDetailsLines(r),
      "",
    ]
    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage()
        y = 12
      }
      doc.text(line, 10, y)
      y += 5
    })
    y += 2
  })

  doc.save(filename)
}

// Export a single report as PDF (used by per-item Download button)
function downloadSingleReportPdf(report: Report) {
  downloadReportsPdf([report], `report-${report.id}.pdf`)
}

export default function ReportsPage() {
  const [reports] = useState<Report[]>(mockReports)
  const [filterType, setFilterType] = useState("all")

  const filteredReports =
    filterType === "all" ? reports : reports.filter((r) => r.type.toLowerCase().includes(filterType))

  const handleExport = (format: "csv" | "pdf") => {
    const date = new Date().toISOString().slice(0, 10)
    if (format === "csv") {
      downloadReportsCsv(filteredReports, `reports-${date}.csv`)
      return
    }
    if (format === "pdf") {
      downloadReportsPdf(filteredReports, `reports-${date}.pdf`)
      return
    }
  }

  return (
    <div className="container py-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-balance font-sans text-4xl font-bold tracking-tight text-foreground">Reports</h1>
        <p className="mt-2 text-pretty text-lg text-muted-foreground">View and export historical scan reports</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="mb-2 block text-sm font-medium text-foreground">Report Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="daily">Daily Summary</SelectItem>
                    <SelectItem value="weekly">Weekly Report</SelectItem>
                    <SelectItem value="monthly">Monthly Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="mb-2 block text-sm font-medium text-foreground">Date Range</label>
                <div className="flex gap-2">
                  <Input type="date" className="flex-1" />
                  <Input type="date" className="flex-1" />
                </div>
              </div>

              <div className="flex items-end gap-2">
                <Button variant="outline" onClick={() => handleExport("csv")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                <Button variant="outline" onClick={() => handleExport("pdf")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reports List */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Report History</CardTitle>
            <CardDescription>
              {filteredReports.length} report{filteredReports.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{report.type}</p>
                      <p className="text-sm text-muted-foreground">{report.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{report.scans} scans</p>
                      <p className="text-xs text-muted-foreground">{report.threats} threats detected</p>
                    </div>

                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      {report.status}
                    </Badge>

                    <Button variant="outline" size="sm" onClick={() => downloadSingleReportPdf(report)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
