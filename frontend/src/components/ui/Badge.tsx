import clsx from "clsx";
import type {
  AppointmentStatus,
  BookingStatus,
  CallMode,
  CallOutcome,
  CallStatus,
  FollowUpStatus,
} from "@/types/domain";

const tones = {
  teal: "bg-teal-500/12 text-teal-300 ring-teal-400/30",
  blue: "bg-sky-500/12 text-sky-300 ring-sky-400/30",
  amber: "bg-amber-500/12 text-amber-300 ring-amber-400/30",
  rose: "bg-rose-500/12 text-rose-300 ring-rose-400/30",
  slate: "bg-slate-500/15 text-slate-300 ring-slate-400/25",
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({
  children,
  tone = "slate",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function CallModeBadge({ mode }: { mode: CallMode }) {
  return mode === "demo" ? (
    <Badge tone="amber">Simulated demo</Badge>
  ) : (
    <Badge tone="teal">Live voice</Badge>
  );
}

const statusMap: Record<CallStatus, { label: string; tone: BadgeTone }> = {
  initiated: { label: "Initiated", tone: "blue" },
  in_progress: { label: "In progress", tone: "blue" },
  completed: { label: "Completed", tone: "teal" },
  abandoned: { label: "Incomplete", tone: "amber" },
  failed: { label: "Failed", tone: "rose" },
};

export function CallStatusBadge({ status }: { status: CallStatus }) {
  const cfg = statusMap[status] ?? { label: status, tone: "slate" };
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}

const outcomeMap: Record<CallOutcome, { label: string; tone: BadgeTone }> = {
  appointment_requested: { label: "Appointment requested", tone: "blue" },
  faq_answered: { label: "FAQ answered", tone: "teal" },
  followup_required: { label: "Follow-up required", tone: "amber" },
  incomplete: { label: "Incomplete call", tone: "slate" },
  no_action: { label: "No action needed", tone: "slate" },
};

export function CallOutcomeBadge({ outcome }: { outcome: CallOutcome | null }) {
  if (!outcome) return <span className="text-xs text-ink-subtle">—</span>;
  const cfg = outcomeMap[outcome] ?? { label: outcome, tone: "slate" };
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}

const bookingMap: Record<BookingStatus, { label: string; tone: BadgeTone }> = {
  none: { label: "No booking", tone: "slate" },
  requested: { label: "Requested (unconfirmed)", tone: "amber" },
  confirmed: { label: "Confirmed booking", tone: "teal" },
  declined: { label: "Declined", tone: "rose" },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const cfg = bookingMap[status] ?? { label: status, tone: "slate" };
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}

const apptMap: Record<AppointmentStatus, { label: string; tone: BadgeTone }> = {
  requested: { label: "Requested (pending staff)", tone: "amber" },
  confirmed: { label: "Confirmed", tone: "teal" },
  completed: { label: "Completed", tone: "blue" },
  cancelled: { label: "Cancelled", tone: "rose" },
  no_show: { label: "No-show", tone: "slate" },
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  const cfg = apptMap[status] ?? { label: status, tone: "slate" };
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}

const followUpMap: Record<FollowUpStatus, { label: string; tone: BadgeTone }> = {
  open: { label: "Open", tone: "amber" },
  in_progress: { label: "In progress", tone: "blue" },
  resolved: { label: "Resolved", tone: "teal" },
  cancelled: { label: "Cancelled", tone: "slate" },
};

export function FollowUpStatusBadge({ status }: { status: FollowUpStatus }) {
  const cfg = followUpMap[status] ?? { label: status, tone: "slate" };
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}
