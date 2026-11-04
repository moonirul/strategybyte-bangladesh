"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { getPortalApi } from "@/lib/api/portal-api";
import { formatDateTime } from "@/lib/format";
import {
  Card,
  EmptyState,
  ErrorBanner,
  PageHeader,
  Skeleton,
} from "@/components/ui/Surface";

export default function PatientsListView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const patientsQuery = useQuery({
    queryKey: ["portal", "patients", { page, pageSize, search }],
    queryFn: async () =>
      (await getPortalApi()).listPatients({
        page,
        pageSize,
        search: search.trim() || undefined,
      }),
  });

  const data = patientsQuery.data;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Patient Directory"
        title="Patients"
        description="Patient records captured from Bangla reception calls, preserving Unicode names and validated phone numbers."
      />

      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search patient name or phone…"
            aria-label="Search patients"
            className="w-full rounded-xl border border-line-strong bg-canvas py-2 pl-9 pr-3.5 text-xs text-ink placeholder:text-ink-subtle focus:border-primary focus:outline-none"
          />
        </div>
      </Card>

      {patientsQuery.isError ? (
        <ErrorBanner
          message={
            patientsQuery.error instanceof Error
              ? patientsQuery.error.message
              : "Failed to load patients."
          }
          onRetry={() => void patientsQuery.refetch()}
        />
      ) : patientsQuery.isLoading ? (
        <Card className="space-y-3 p-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </Card>
      ) : !data || data.items.length === 0 ? (
        <Card>
          <EmptyState
            title="No patient records found"
            description="Patient profiles are created when callers provide their name or validated mobile number."
          />
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line bg-surface-raised/60 text-xs text-ink-muted">
                  <tr>
                    <th className="px-6 py-3.5 font-medium">Patient Name</th>
                    <th className="px-6 py-3.5 font-medium">Phone</th>
                    <th className="px-6 py-3.5 font-medium">Calls</th>
                    <th className="px-6 py-3.5 font-medium">Last Call</th>
                    <th className="px-6 py-3.5 font-medium">First Recorded</th>
                    <th className="px-6 py-3.5 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {data.items.map((patient) => (
                    <tr
                      key={patient.id}
                      className="transition hover:bg-surface-hover/50"
                    >
                      <td className="px-6 py-3.5 font-bangla font-medium text-ink">
                        <Link
                          href={`/portal/patients/${patient.id}`}
                          className="hover:text-primary-soft hover:underline"
                        >
                          {patient.fullName}
                        </Link>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-xs text-ink-muted">
                        {patient.phoneDisplay ?? "Unverified / missing"}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-xs text-ink">
                        {patient.callCount}
                      </td>
                      <td className="px-6 py-3.5 text-xs text-ink-muted">
                        {formatDateTime(patient.lastCallAt)}
                      </td>
                      <td className="px-6 py-3.5 text-xs text-ink-muted">
                        {formatDateTime(patient.createdAt)}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Link
                          href={`/portal/patients/${patient.id}`}
                          className="rounded-lg border border-line-strong px-2.5 py-1 text-xs font-medium text-primary-soft transition hover:border-primary"
                        >
                          Profile →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="flex items-center justify-between text-xs text-ink-muted">
            <span>
              Page <strong className="text-ink">{data.page}</strong> of{" "}
              <strong className="text-ink">{totalPages}</strong> ({data.total}{" "}
              patients)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-3 py-1.5 text-ink disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Prev
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-3 py-1.5 text-ink disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
