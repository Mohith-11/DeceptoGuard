"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Reports", href: "/reports" },
  { name: "About", href: "/about" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-sans">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold tracking-tight text-foreground">DeceptoGuard</span>
        </Link>

        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative",
                pathname === item.href ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {item.name}
              {pathname === item.href && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary" // changed from bg-primary-foreground
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
