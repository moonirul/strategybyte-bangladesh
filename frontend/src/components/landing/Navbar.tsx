"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useVoiceModal } from "@/components/voice/VoiceCallModal";

const navItems = [
  { href: "#product", label: "Product" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#use-cases", label: "Use cases" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openCallModal } = useVoiceModal();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/85 backdrop-blur-md">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"
      >
        <Logo />

        <ul className="hidden items-center gap-7 text-sm text-ink-muted md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="transition hover:text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/portal"
            className="rounded-full border border-line-strong px-4 py-2 text-xs font-medium text-ink transition hover:border-primary hover:text-primary-soft"
          >
            Staff Portal
          </Link>
          <button
            type="button"
            onClick={() => openCallModal("demo")}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-canvas shadow-[var(--shadow-glow)] transition hover:bg-primary-hover"
          >
            <Phone className="h-3.5 w-3.5" />
            Talk to our Bangla caller
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          className="rounded-lg border border-line p-2 text-ink-muted transition hover:text-ink md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div
          id="mobile-nav-menu"
          className="border-t border-line bg-surface px-6 py-5 md:hidden"
        >
          <ul className="space-y-3 text-sm text-ink-muted">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-1 text-ink transition hover:text-primary-soft"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-2.5 border-t border-line pt-4">
            <Link
              href="/portal"
              onClick={() => setMobileOpen(false)}
              className="rounded-full border border-line-strong px-4 py-2.5 text-center text-xs font-medium text-ink"
            >
              Staff Portal
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openCallModal("demo");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-canvas"
            >
              <Phone className="h-3.5 w-3.5" />
              Talk to our Bangla caller
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
