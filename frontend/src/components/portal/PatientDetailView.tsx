"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarCheck, PhoneCall, User } from "lucide-react";
import { getPortalApi } from "@/lib/api/portal-api";
import { formatDateTime, formatDuration } from "@/lib/format";
import {
  AppointmentStatusBadge,
  CallModeBadge,
  CallOutcomeBadge,
  CallStatusBadge,
} from "@/components/ui/Badge";
import {
  Card,
  EmptyState,
  ErrorBanner,
  Skeleton,
} from "@/components/ui/Surface";

export default function PatientDetailView({
  patientId,
}: {
  patientId: string;
}) {
  const patientQuery = useQuery({
    queryKey: ["portal", "patient", patientId],
    queryFn: async () => (await getPortalApi()).getPatient(patientId),
  });

  if (patientQuery.isError) {
    return (
      <div className="space-y-4">
        <Link
          href="/portal/patients"
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to patients
        </Link>
        <ErrorBanner
          title="Could not load patient record"
          message={
            patientQuery.error instanceof Error
              ? patientQuery.error.message
              : "Patient not found."
          }
          onRetry={() => void patientQuery.refetch()}
        />
      </div>
    );
  }

  if (patientQuery.isLoading || !patientQuery.data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const p = patientQuery.data;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/portal/patients"
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to patients
        </Link>
        <h1 className="mt-2 font-bangla text-2xl font-semibold text-ink sm:text-3xl">
          {p.fullName}
        </h1>
        <p className="mt-1 font-mono text-xs text-ink-subtle">
          Patient ID: {p.id} · Created: {formatDateTime(p.createdAt)}
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 border-b border-line pb-3">
          <User className="h-4 w-4 text-primary-soft" />
          <h2 className="text-sm font-semibold text-ink">Contact Summary</h2>
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
          <div>
            <dt className="text-ink-subtle">Phone (E.164)</dt>
            <dd className="mt-1 font-mono text-sm text-ink">
              {p.phoneE164 ?? p.phoneDisplay ?? "Not verified"}
            </dd>
          </div>
          <div>
            <dt className="text-ink-subtle">Total Calls</dt>
            <dd className="mt-1 font-mono text-sm text-ink">{p.callCount}</dd>
          </div>
          <div>
            <dt className="text-ink-subtle">Last Interaction</dt>
            <dd className="mt-1 text-sm text-ink">
              {formatDateTime(p.lastCallAt)}
            </dd>
          </div>
        </dl>
      </Card>

      {/* Linked Call History */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-line px-6 py-4">
          <PhoneCall className="h-4 w-4 text-primary-soft" />
          <h2 className="text-sm font-semibold text-ink">
            Linked Call History ({p.calls.length})
          </h2>
        </div>
        {p.calls.length === 0 ? (
          <EmptyState title="No calls linked to this patient" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-surface-raised/60 text-xs text-ink-muted">
                <tr>
                  <th className="px-6 py-3 font-medium">Started</th>
                  <th className="px-6 py-3 font-medium">Mode</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Outcome</th>
                  <th className="px-6 py-3 font-medium">Duration</th>
                  <th className="px-6 py-3 text-right font-medium">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {p.calls.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-hover/50">
                    <td className="px-6 py-3.5 text-xs text-ink-muted">
                      {formatDateTime(c.startedAt)}
                    </td>
                    <td className="px-6 py-3.5">
                      <CallModeBadge mode={c.callMode} />
                    </td>
                    <td className="px-6 py-3.5">
                      <CallStatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-3.5">
                      <CallOutcomeBadge outcome={c.outcome} />
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs text-ink-muted">
                      {formatDuration(c.durationSeconds)}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        href={`/portal/calls/${c.id}`}
                        className="text-xs font-medium text-primary-soft hover:underline"
                      >
                        Open call →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Linked Appointments */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-line px-6 py-4">
          <CalendarCheck className="h-4 w-4 text-primary-soft" />
          <h2 className="text-sm font-semibold text-ink">
            Appointments & Requests ({p.appointments.length})
          </h2>
        </div>
        {p.appointments.length === 0 ? (
          <EmptyState title="No appointment requests for this patient" />
        ) : (
          <div className="divide-y divide-line">
            {p.appointments.map((a) => (
              <div
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 text-xs"
              >
                <div>
                  <p className="font-bangla text-sm font-medium text-ink">
                    Spoken preference: {a.requestedPreference ?? "—"}
                  </p>
                  <p className="mt-0.5 text-ink-muted">
                    Doctor: {a.doctor?.fullName ?? "Any available"} · Scheduled:{" "}
                    {formatDateTime(a.scheduledStart)}
                  </p>
                </div>
                <AppointmentStatusBadge status={a.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
