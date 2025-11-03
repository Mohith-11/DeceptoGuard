"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, AlertTriangle, CheckCircle2, XCircle, Loader2, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { scanURL, type ScanResult } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

// Mock data for the chart
const chartData = [
  { date: "Jan", attempts: 12 },
  { date: "Feb", attempts: 19 },
  { date: "Mar", attempts: 8 },
  { date: "Apr", attempts: 15 },
  { date: "May", attempts: 22 },
  { date: "Jun", attempts: 11 },
  { date: "Jul", attempts: 17 },
]

export default function DashboardPage() {
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [scanResults, setScanResults] = useState<ScanResult[]>([
    {
      id: "1",
      url: "https://paypa1-secure.com/login",
      score: 92,
      status: "phishing",
      timestamp: new Date().toLocaleString(),
      reasons: ["Typo in domain (paypal)", "Suspicious URL length", "Contains digits in brand name"],
    },
    {
      id: "2",
      url: "https://google.com",
      score: 5,
      status: "safe",
      timestamp: new Date().toLocaleString(),
      reasons: ["Legitimate domain", "Uses HTTPS", "No suspicious patterns"],
    },
  ])

  const sanitizeUrl = (u: string) => {
    // trim and strip trailing punctuation commonly attached in text blobs
    return u.trim().replace(/[),.;]+$/g, "")
  }

  const extractUrls = (value: string) => {
    if (!value) return []
    // Strategy: split by each http(s):// appearance, then rebuild with protocol
    const indices: number[] = []
    const re = /https?:\/\//gi
    let m: RegExpExecArray | null
    while ((m = re.exec(value)) !== null) {
      indices.push(m.index)
    }
    if (indices.length === 0) return []

    const urls: string[] = []
    for (let i = 0; i < indices.length; i++) {
      const start = indices[i]
      const end = i + 1 < indices.length ? indices[i + 1] : value.length
      const candidate = value.slice(start, end)
      // candidate starts with protocol; sanitize trailing junk
      const sanitized = sanitizeUrl(candidate)
      // basic validity: keep chars until whitespace
      const firstSpace = sanitized.search(/\s/)
      const finalStr = firstSpace > -1 ? sanitized.slice(0, firstSpace) : sanitized
      if (finalStr.length > 0) urls.push(finalStr)
    }
    return urls
  }

  const handleScan = async () => {
    if (!url) return

    setIsScanning(true)
    setError(null)

    try {
      const found = extractUrls(url)
      if (found.length === 0) {
        setError("No valid http(s) URL found. Please enter a single URL (e.g., https://example.com).")
        setIsScanning(false)
        return
      }
      if (found.length > 1) {
        setError("Multiple URLs detected. Please enter exactly one URL at a time.")
        setIsScanning(false)
        return
      }

      const urlToScan = found[0]

      const result = await scanURL(urlToScan)
      setScanResults((prev) => [result, ...prev])
      toast({
        title: "Scan Complete",
        description: `URL analyzed: ${result.status.toUpperCase()}`,
      })
      setUrl("")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to scan URL"
      setError(errorMessage)
      toast({
        title: "Scan Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsScanning(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "suspicious":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "phishing":
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      safe: "bg-green-100 text-green-800 border-green-200",
      suspicious: "bg-yellow-100 text-yellow-800 border-yellow-200",
      phishing: "bg-red-100 text-red-800 border-red-200",
    }
    return variants[status as keyof typeof variants] || ""
  }

  return (
    <div className="container py-8">
      {/* Lightweight Top Banner */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 rounded-lg border border-border/60 p-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Comprehensive Protection Dashboard</h2>
            {/* Ensure banner subtext is blue (not white) */}
            <p className="text-sm text-foreground/90">
              Scan URLs in real-time and monitor campus-wide phishing activity.
            </p>
          </div>
          <Button
            size="lg"
            className="h-12 px-8 text-base font-semibold"
            onClick={() => {
              const input = document.querySelector<HTMLInputElement>('input[placeholder="https://example.com"]')
              input?.focus()
              input?.scrollIntoView({ behavior: "smooth", block: "center" })
            }}
          >
            Start Scanning
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-balance font-sans text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-2 text-pretty text-lg text-muted-foreground">
          Scan URLs and files for phishing threats in real-time
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>URL Scanner</CardTitle>
              <CardDescription>Enter a URL to analyze for phishing patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Paste one URL (e.g., https://example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleScan()}
                  className="flex-1"
                />
                <Button onClick={handleScan} disabled={isScanning || !url}>
                  {isScanning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    "Scan Now"
                  )}
                </Button>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-3">
                  <p className="text-sm text-destructive">{error}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    If the backend is unavailable, a local heuristic analysis will still run.
                  </p>
                </div>
              )}

              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Drag and drop files here, or click to browse</p>
                <p className="mt-1 text-xs text-muted-foreground">Supports .txt, .csv, .eml files</p>
              </div>

              <Alert className="mt-4">
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Optional DNS to reduce ads</AlertTitle>
                <AlertDescription>
                  For fewer ads on external websites, you can configure your device or router to use:
                  <span className="ml-1 rounded bg-muted px-1 py-0.5 font-mono">dns.adguard-dns.com</span>. This tip is
                  optional and managed outside this app—change DNS only if it’s appropriate for your network.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Scans</span>
                <span className="text-2xl font-bold text-foreground">247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Threats Detected</span>
                <span className="text-2xl font-bold text-destructive">34</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Detection Rate</span>
                <span className="text-2xl font-bold text-green-600">98.5%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Results Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Real-time scanning results and threat analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scanResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex flex-col gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-1 items-start gap-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1 space-y-1">
                        <p className="font-mono text-sm text-foreground">{result.url}</p>
                        <p className="text-xs text-muted-foreground">{result.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{result.score}</p>
                        <p className="text-xs text-muted-foreground">Risk Score</p>
                      </div>
                      <Badge className={getStatusBadge(result.status)} variant="outline">
                        {result.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  {result.reasons.length > 0 && (
                    <div className="ml-8 space-y-1">
                      {result.reasons.map((reason, i) => (
                        <p key={i} className="text-xs text-muted-foreground">
                          • {reason}
                        </p>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Chart Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Phishing Attempts Over Time</CardTitle>
            <CardDescription>Monthly trend analysis of detected threats</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                attempts: {
                  label: "Phishing Attempts",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="attempts" fill="var(--color-attempts)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
