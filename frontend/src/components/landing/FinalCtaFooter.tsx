import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { TalkToBanglaCallerButton } from "@/components/voice/VoiceCallModal";
import { env } from "@/lib/env";

export default function FinalCtaFooter() {
  return (
    <>
      <section id="contact" className="scroll-mt-16 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-line-strong bg-surface p-8 text-center shadow-[var(--shadow-card)] sm:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 left-1/2 h-56 w-[520px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
            />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-soft">
                Interactive Assessment Demo
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Test the Bangla receptionist and inspect the staff portal.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
                Start a simulated call right in your browser, submit an appointment
                request in Bangla, and review the structured call record in the Dhaka
                Dental Care portal.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
                <TalkToBanglaCallerButton />
                <Link
                  href="/portal"
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-raised px-5 py-3 text-sm font-medium text-ink transition hover:border-primary hover:text-primary-soft"
                >
                  <span>Go to Staff Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {env.contactEmail && (
                <p className="mt-6 text-xs text-ink-muted">
                  Contact:{" "}
                  <a
                    href={`mailto:${env.contactEmail}`}
                    className="underline underline-offset-4 hover:text-ink"
                  >
                    {env.contactEmail}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-xs text-ink-muted sm:flex-row">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-ink-subtle">·</span>
            <span>A StrategyByte product assessment build</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#product" className="hover:text-ink">
              Product
            </a>
            <a href="#how-it-works" className="hover:text-ink">
              How it works
            </a>
            <a href="#use-cases" className="hover:text-ink">
              Use cases
            </a>
            <Link href="/portal" className="hover:text-ink">
              Staff Portal
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
