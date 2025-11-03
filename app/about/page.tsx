"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Target } from "lucide-react"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <div className="container py-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-balance font-sans text-4xl font-bold tracking-tight text-foreground">
          About DeceptoGuard
        </h1>
        <p className="mt-2 text-pretty text-lg text-muted-foreground">
          Protecting academic institutions from phishing threats
        </p>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-12"
      >
        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="mb-4 font-sans text-2xl font-bold text-foreground">Our Mission</h2>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  DeceptoGuard is dedicated to safeguarding academic institutions from the growing threat of phishing attacks. We leverage cutting-edge machine learning algorithms and real-time pattern recognition to identify and neutralize phishing attempts before they can compromise sensitive educational data and systems.
                </p>
                <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                  Our platform is specifically designed for the unique challenges faced by universities, colleges, and
                  research institutions, where open collaboration must be balanced with robust security measures.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Features */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="mb-6 font-sans text-2xl font-bold text-foreground">What We Do</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 font-sans text-lg font-semibold text-foreground">Advanced Detection</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Our ML models analyze URL patterns, domain characteristics, and content features to identify
                sophisticated phishing attempts with high accuracy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 font-sans text-lg font-semibold text-foreground">Real-Time Protection</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Instant scanning and analysis of URLs and files ensures threats are identified and blocked before they
                can cause harm to your institution.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
