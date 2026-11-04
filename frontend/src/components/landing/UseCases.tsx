import { Building2, FlaskConical, BellRing, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const useCases = [
  {
    icon: Stethoscope,
    title: "Dental clinics",
    badge: "Demonstrated in Dhaka Dental Care",
    tone: "teal" as const,
    description:
      "Handle toothache triage questions, scaling or orthodontic consultation requests, doctor preferences, and opening-hour enquiries.",
  },
  {
    icon: FlaskConical,
    title: "Diagnostic centres",
    badge: "Supported workflow pattern",
    tone: "blue" as const,
    description:
      "Collect test booking enquiries, fasting or preparation FAQ requests, and callback requests for specialised pathology or imaging.",
  },
  {
    icon: Building2,
    title: "Hospital outpatient departments (OPD)",
    badge: "Supported workflow pattern",
    tone: "blue" as const,
    description:
      "Route high-volume serial requests by specialty, capture patient contact numbers in Bangla, and queue complex cases for desk operators.",
  },
  {
    icon: BellRing,
    title: "Appointment reminders & follow-up workflows",
    badge: "Future outbound integration",
    tone: "amber" as const,
    description:
      "Staff can track pending follow-up requests in the portal today; automated outbound reminder calls and SMS notifications are planned for live telephony integration.",
  },
];

export default function UseCases() {
  return (
    <section
      id="use-cases"
      className="scroll-mt-16 border-b border-line/70 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-soft">
            Healthcare use cases
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Built for healthcare providers across Bangladesh.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            We clearly distinguish what is active in the assessment demo today from
            future live telephony and outbound integrations.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {useCases.map(({ icon: Icon, title, badge, tone, description }) => (
            <div
              key={title}
              className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-line-strong bg-surface-raised text-primary-soft">
                  <Icon className="h-5 w-5" />
                </div>
                <Badge tone={tone}>{badge}</Badge>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
