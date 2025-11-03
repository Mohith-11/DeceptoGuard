"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Search, BarChart3, FileText } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Search,
    title: "Real-Time Scanning",
    description: "Instantly analyze URLs and files for phishing patterns with advanced ML algorithms.",
  },
  {
    icon: BarChart3,
    title: "Threat Analytics",
    description: "Visualize phishing trends and patterns across your academic infrastructure.",
  },
  {
    icon: FileText,
    title: "Detailed Reports",
    description: "Generate comprehensive reports with actionable insights and export capabilities.",
  },
  {
    icon: Shield,
    title: "Academic Protection",
    description: "Purpose-built for educational institutions with specialized threat detection.",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 py-20 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          <h1 className="text-balance font-serif text-5xl font-bold tracking-tight uppercase text-heading sm:text-6xl lg:text-7xl">
            real time phishing detection for academic networks
          </h1>
          <p className="mx-auto max-w-3xl text-pretty text-lg leading-relaxed text-foreground/90 sm:text-xl">
            Real-time phishing detection, analytics, and reporting—purpose-built to protect your campus and digital
            ecosystem.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/dashboard">
            <Button size="lg" className="h-14 px-10 text-lg font-semibold">
              Start Scanning
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="container py-14">
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="rounded-2xl border border-primary/30 shadow-sm ring-1 ring-primary/10"
        >
          <div className="border-b border-primary/20 bg-muted/20 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-primary"></span>
              <span className="h-2 w-2 rounded-full bg-primary/70"></span>
              <span className="h-2 w-2 rounded-full bg-primary/50"></span>
              <div className="ml-4 flex items-center gap-3 text-sm">
                <span className="rounded-full border border-primary/30 px-3 py-1 text-foreground">Overview</span>
                <span className="rounded-full border border-border/70 px-3 py-1 text-foreground/70">Scans</span>
                <span className="rounded-full border border-border/70 px-3 py-1 text-foreground/70">Reports</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border/60 p-5">
              <p className="text-sm text-foreground/80">Active Scans</p>
              <p className="mt-2 text-3xl font-bold text-foreground">42</p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded bg-muted">
                <div className="h-2 w-[68%] bg-primary"></div>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 p-5">
              <p className="text-sm text-foreground/80">Threats Blocked</p>
              <p className="mt-2 text-3xl font-bold text-foreground">1,287</p>
              <p className="mt-1 text-xs text-foreground/70">Last 30 days</p>
            </div>

            <div className="rounded-xl border border-border/60 p-5">
              <p className="text-sm text-foreground/80">Avg. Time to Verdict</p>
              <p className="mt-2 text-3xl font-bold text-foreground">~200ms</p>
              <p className="mt-1 text-xs text-foreground/70">Median classification latency</p>
            </div>

            <div className="rounded-xl border border-border/60 p-5 sm:col-span-2 lg:col-span-3">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">Protect your institution today</h3>
                  <p className="mt-1 text-sm text-foreground/80">
                    Launch campus-wide phishing defense with real-time scanning, analytics, and incident reporting.
                  </p>
                </div>
                <Link href="/dashboard">
                  <Button size="lg" className="h-12 px-8 text-base font-semibold">
                    Start Scanning
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-balance font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Comprehensive Protection
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Advanced features designed specifically for academic environments
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card transition-colors hover:border-primary/50">
                  <CardContent className="flex flex-col gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-sans text-lg font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm leading-relaxed text-foreground/80">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Protection Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid items-stretch gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border/60 p-8">
              <h2 className="text-balance font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Protect Your Institution Today
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-foreground/90">
                Deploy enterprise-grade phishing protection across email, LMS portals, and campus services. Our
                ML-powered engine continuously analyzes URLs and patterns to stop threats before they spread.
              </p>
              <ul className="mt-6 list-disc space-y-2 pl-5 text-foreground/90">
                <li>Real-time URL scanning with instant risk scoring</li>
                <li>Organization-wide dashboards for administrators</li>
                <li>Detailed forensic reports for incident response</li>
                <li>Simple deployment with minimal performance overhead</li>
              </ul>
              <div className="mt-8">
                <Link href="/dashboard">
                  <Button size="lg" className="h-14 w-full sm:w-auto px-10 text-lg font-semibold">
                    Start Scanning
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border/50 p-4">
                  <p className="text-sm text-foreground/80">Coverage</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">Campus-wide</p>
                  <p className="mt-2 text-sm text-foreground/80">Email, LMS, Portals</p>
                </div>
                <div className="rounded-lg border border-border/50 p-4">
                  <p className="text-sm text-foreground/80">Detection Rate</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">98.5%</p>
                  <p className="mt-2 text-sm text-foreground/80">Based on internal testing</p>
                </div>
                <div className="rounded-lg border border-border/50 p-4">
                  <p className="text-sm text-foreground/80">Time to Verdict</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">~200ms</p>
                  <p className="mt-2 text-sm text-foreground/80">Median classification latency</p>
                </div>
                <div className="rounded-lg border border-border/50 p-4">
                  <p className="text-sm text-foreground/80">Scans This Month</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">12,497</p>
                  <p className="mt-2 text-sm text-foreground/80">Across all departments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto flex max-w-2xl flex-col gap-6"
        >
          <h2 className="text-balance font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Protect Your Institution Today
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-foreground/90">
            Launch proactive phishing defense in minutes with DeceptoNetEDU.
          </p>
          <div>
            <Link href="/dashboard">
              <Button size="lg" className="h-14 w-full sm:w-auto px-10 text-lg font-semibold">
                Start Scanning
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
