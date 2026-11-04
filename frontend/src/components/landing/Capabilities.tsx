import {
  CalendarClock,
  FileCheck2,
  HelpCircle,
  Languages,
  LayoutList,
  PhoneForwarded,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const capabilities = [
  {
    icon: Languages,
    title: "Bangla & Bangla-English support",
    status: "Available in demo",
    description:
      "Handles conversational Bangla and common English medical/scheduling terms while preserving Unicode text accurately.",
  },
  {
    icon: CalendarClock,
    title: "Appointment request handling",
    status: "Available in demo",
    description:
      "Captures reason for visit, preferred day/time, and preferred doctor. Requests are recorded as unconfirmed until clinic staff verify availability.",
  },
  {
    icon: UserCheck,
    title: "Patient detail capture & validation",
    status: "Available in demo",
    description:
      "Normalises valid Bangladeshi mobile numbers (Bangla or ASCII digits) to E.164 format and flags uncertain numbers for staff review.",
  },
  {
    icon: HelpCircle,
    title: "Approved clinic FAQ responses",
    status: "Available in demo",
    description:
      "Answers configured clinic opening hours and location enquiries without improvising clinical advice or unapproved fee quotes.",
  },
  {
    icon: PhoneForwarded,
    title: "Human callback escalation",
    status: "Available in demo",
    description:
      "When a caller asks an unapproved question or provides ambiguous details, ByteVoice creates a structured follow-up request for reception staff.",
  },
  {
    icon: FileCheck2,
    title: "Structured call history & transcripts",
    status: "Available in demo",
    description:
      "Stores sequenced transcript turns with speaker labels, timestamps, and extracted clinical intent.",
  },
  {
    icon: LayoutList,
    title: "Staff visibility & portal workflows",
    status: "Available in demo",
    description:
      "Role-aware staff portal for reviewing calls, patients, appointment requests, and pending human follow-ups.",
  },
];

export default function Capabilities() {
  return (
    <section
      id="product"
      className="scroll-mt-16 border-b border-line/70 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-soft">
            Product capabilities
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Designed for clinical accuracy and front-desk reliability.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            ByteVoice never fabricates medical advice or marks an appointment as
            confirmed before your scheduling team approves it.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, status, description }) => (
            <article
              key={title}
              className="flex flex-col justify-between rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] transition hover:border-line-strong"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="grid h-10 w-10 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary-soft">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge tone="teal">{status}</Badge>
                </div>
                <h3 className="mt-5 text-base font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
