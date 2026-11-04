import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import HeroSceneLoader from "@/components/three/HeroSceneLoader";
import { TalkToBanglaCallerButton } from "@/components/voice/VoiceCallModal";
import { Badge } from "@/components/ui/Badge";
import { demoClinic } from "@/config/demo-clinic";

const valuePoints = [
  "Answer common patient enquiries in natural Bangla",
  "Capture structured appointment requests without false confirmations",
  "Reduce repetitive front-desk reception work",
  "Organise every call, transcript, and follow-up in a staff portal",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line/70">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-36 left-1/2 h-[440px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-14 lg:grid-cols-12 lg:py-24">
        {/* Copy & CTAs */}
        <div className="lg:col-span-7">
          <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-line-strong bg-surface/90 px-3.5 py-1.5 text-xs text-ink-muted">
            <Sparkles className="h-3.5 w-3.5 text-primary-soft" />
            <span>ByteVoice Bangladesh · Demo clinic: {demoClinic.name}</span>
            <Badge tone="amber">Interactive Demo Mode</Badge>
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            Every patient call deserves an answer.
          </h1>

          <p
            lang="bn"
            className="mt-4 font-bangla text-xl font-medium leading-relaxed text-primary-soft sm:text-2xl"
          >
            আপনার ক্লিনিকের প্রতিটি কলের উত্তর দিন—সহজ, স্বাভাবিক বাংলায়।
          </p>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
            ByteVoice helps dental clinics, diagnostic centres, and outpatient
            departments handle high call volumes in Bangla—capturing patient
            details, appointment requests, and callback needs into a clean clinical
            staff portal.
          </p>

          <ul className="mt-6 grid gap-2.5 text-sm text-ink-muted sm:grid-cols-2">
            {valuePoints.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <TalkToBanglaCallerButton />
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-5 py-3 text-sm font-medium text-ink transition hover:border-primary hover:text-primary-soft"
            >
              <span>Open Staff Portal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-4 text-xs text-ink-subtle">
            Note: The browser experience currently runs in a deterministic simulated
            demo mode so you can inspect the full call-to-portal workflow without
            external voice credentials.
          </p>
        </div>

        {/* 3D Visualisation + Live Product Card */}
        <div className="relative lg:col-span-5">
          <div className="relative h-[340px] w-full rounded-[var(--radius-card)] border border-line bg-surface/60 sm:h-[400px]">
            <HeroSceneLoader />
            <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-line bg-canvas/85 px-3 py-1 text-[11px] text-ink-muted backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>Decorative 3D voice field · WebGL / R3F</span>
            </div>
          </div>

          {/* Subtle live-product interface detail */}
          <div className="-mt-12 relative z-10 mx-4 rounded-2xl border border-line-strong bg-surface-raised/95 p-4 shadow-[var(--shadow-card)] backdrop-blur">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-ink">
                Sample Call Record · {demoClinic.name}
              </span>
              <Badge tone="amber">Requested (unconfirmed)</Badge>
            </div>
            <p
              lang="bn"
              className="mt-2 font-bangla text-xs leading-relaxed text-ink-muted"
            >
              “আমি আগামীকাল বিকাল ৫টায় ডা. ফারজানা হকের কাছে দাঁতে ব্যথার জন্য
              অ্যাপয়েন্টমেন্ট নিতে চাই।”
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2.5 text-[11px] text-ink-subtle">
              <span>Intent: Appointment request</span>
              <span className="font-mono text-ink-muted">Phone: +880 17•• •••678</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
