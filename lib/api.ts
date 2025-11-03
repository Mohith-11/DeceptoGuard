// API utility functions for backend integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface PredictionResponse {
  url: string
  result: "Phishing" | "Legitimate"
  reasons: string[]
}

export interface ScanResult {
  id: string
  url: string
  score: number
  status: "safe" | "suspicious" | "phishing"
  timestamp: string
  reasons: string[]
}

async function fetchWithTimeout(resource: string, options: RequestInit = {}, timeoutMs = 5000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const resp = await fetch(resource, { ...options, signal: controller.signal })
    return resp
  } finally {
    clearTimeout(id)
  }
}

function analyzeUrlHeuristics(url: string): ScanResult {
  const reasons: string[] = []
  let score = 10

  let parsed: URL | null = null
  try {
    parsed = new URL(url)
  } catch {
    reasons.push("Invalid URL format")
    score += 30
    return finalize("phishing")
  }

  const hostname = parsed.hostname.toLowerCase()
  const protocol = parsed.protocol.toLowerCase()
  const full = url
  const labels = hostname.split(".").filter(Boolean)

  // helper: naive eTLD+1 (last two labels)
  const etld1 = labels.slice(-2).join(".")

  // protocol
  if (protocol !== "https:") {
    reasons.push("Uses HTTP (no TLS)")
    score += 25
  }

  // @ symbol
  if (full.includes("@")) {
    reasons.push("URL contains '@' (possible credential obfuscation)")
    score += 15
  }

  // punycode
  if (hostname.includes("xn--")) {
    reasons.push("Hostname uses punycode (lookalike risk)")
    score += 15
  }

  // IP host
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    reasons.push("Hostname is an IP address")
    score += 25
  }

  // subdomain depth
  if (labels.length > 3) {
    reasons.push(`Many subdomains detected (${labels.length})`)
    score += 15
  }

  // length checks
  if (hostname.length > 45) {
    reasons.push("Unusually long hostname")
    score += 10
  }
  if (full.length > 120) {
    reasons.push("Unusually long URL")
    score += 10
  }

  // suspicious keywords
  const keywords = ["login", "verify", "secure", "update", "account", "confirm", "signin", "pay", "reset"]
  const keywordHit =
    keywords.some((k) => hostname.includes(k)) || keywords.some((k) => parsed!.pathname.toLowerCase().includes(k))
  if (keywordHit) {
    reasons.push("Suspicious keywords in host/path")
    score += 10
  }

  // brand impersonation heuristics
  const brands = ["paypal", "google", "apple", "amazon", "bankofamerica"]
  const labelSet = new Set(labels)
  const apexBrand = brands.find((b) => etld1.startsWith(b + ".") || etld1 === `${b}.com`)
  // brand present somewhere in subdomains not matching apex
  for (const b of brands) {
    const brandInLabels = labels.some((l) => l.includes(b))
    if (brandInLabels) {
      const apexMatchesBrand = etld1.startsWith(`${b}.`) || etld1 === `${b}.com`
      if (!apexMatchesBrand) {
        reasons.push(`Brand appears in subdomain but apex is '${etld1}' (subdomain trick)`)
        score += 30
        break
      }
    }
  }

  // obvious digit substitution in brand fragment (e.g., paypa1)
  const leetPatterns = [
    [/paypa1|paypаl|paypAI/i, "Possible PayPal lookalike (digit/char substitution)"],
    [/g00gle|go0gle/i, "Possible Google lookalike (digit/char substitution)"],
    [/app1e|appl3/i, "Possible Apple lookalike (digit/char substitution)"],
    [/amaz0n/i, "Possible Amazon lookalike (digit/char substitution)"],
    [/bank0famerica|bankofamer1ca/i, "Possible Bank of America lookalike (digit/char substitution)"],
  ]
  for (const [regex, msg] of leetPatterns) {
    if (regex.test(hostname)) {
      reasons.push(msg as string)
      score += 20
      break
    }
  }

  function finalize(defaultHigh: "safe" | "suspicious" | "phishing"): ScanResult {
    let status: "safe" | "suspicious" | "phishing"
    if (score >= 70) status = "phishing"
    else if (score >= 40) status = "suspicious"
    else status = "safe"

    return {
      id: Date.now().toString(),
      url,
      score: Math.min(100, Math.max(0, score)),
      status: status || defaultHigh,
      timestamp: new Date().toLocaleString(),
      reasons: reasons.length ? reasons : ["Local heuristic analysis complete"],
    }
  }

  return finalize("suspicious")
}

/**
 * Scan a URL for phishing using the Flask backend
 */
export async function scanURL(url: string): Promise<ScanResult> {
  try {
    const formData = new FormData()
    formData.append("url", url)

    const response = await fetchWithTimeout(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      // Backend reachable but returned error – fall back to local analysis
      return {
        ...analyzeUrlHeuristics(url),
        reasons: [
          `Backend responded with ${response.status} ${response.statusText}`,
          ...analyzeUrlHeuristics(url).reasons,
        ],
      }
    }

    // Parse the HTML response (your backend returns HTML)
    const html = await response.text()

    // Extract result and reasons from HTML
    const resultMatch = html.match(/Result:\s*(Phishing|Legitimate)/i)
    const result = resultMatch ? resultMatch[1] : "Unknown"

    // Extract reasons
    const reasonsMatch = html.match(/<ul>(.*?)<\/ul>/s)
    const reasons: string[] = []
    if (reasonsMatch) {
      const liMatches = reasonsMatch[1].matchAll(/<li>(.*?)<\/li>/g)
      for (const match of liMatches) {
        reasons.push(match[1])
      }
    }

    // Calculate score based on result and reasons
    const isPhishing = result === "Phishing"
    const baseScore = isPhishing ? 70 : 10
    const reasonScore = reasons.length * 5
    const score = Math.min(100, baseScore + reasonScore)

    // Determine status
    let status: "safe" | "suspicious" | "phishing"
    if (score >= 70) {
      status = "phishing"
    } else if (score >= 40) {
      status = "suspicious"
    } else {
      status = "safe"
    }

    return {
      id: Date.now().toString(),
      url,
      score,
      status,
      timestamp: new Date().toLocaleString(),
      reasons: reasons.length > 0 ? reasons : ["Analysis complete"],
    }
  } catch (error) {
    const local = analyzeUrlHeuristics(url)
    return {
      ...local,
      reasons: ["Backend unreachable or timed out", ...local.reasons],
    }
  }
}

/**
 * Alternative: Use JSON API if you modify your backend
 * This is a helper function for future JSON-based API
 */
export async function scanURLJSON(url: string): Promise<ScanResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data: PredictionResponse = await response.json()

    const isPhishing = data.result === "Phishing"
    const baseScore = isPhishing ? 70 : 10
    const reasonScore = data.reasons.length * 5
    const score = Math.min(100, baseScore + reasonScore)

    let status: "safe" | "suspicious" | "phishing"
    if (score >= 70) {
      status = "phishing"
    } else if (score >= 40) {
      status = "suspicious"
    } else {
      status = "safe"
    }

    return {
      id: Date.now().toString(),
      url: data.url,
      score,
      status,
      timestamp: new Date().toLocaleString(),
      reasons: data.reasons,
    }
  } catch (error) {
    console.error("Error scanning URL:", error)
    throw new Error("Failed to scan URL. Make sure the backend is running.")
  }
}
