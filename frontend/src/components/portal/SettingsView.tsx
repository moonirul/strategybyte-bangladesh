"use client";

import { useQuery } from "@tanstack/react-query";
import { Building2, Database, Mic, ShieldCheck } from "lucide-react";
import { demoClinic } from "@/config/demo-clinic";
import { getPortalApi } from "@/lib/api/portal-api";
import {
  env,
  isApiConfigured,
  isFixtureMode,
  isSupabaseConfigured,
  isVapiConfigured,
} from "@/lib/env";
import { Badge } from "@/components/ui/Badge";
import { Card, PageHeader } from "@/components/ui/Surface";

export default function SettingsView() {
  const healthQuery = useQuery({
    queryKey: ["portal", "health"],
    queryFn: async () => (await getPortalApi()).health(),
  });

  const meQuery = useQuery({
    queryKey: ["portal", "me"],
    queryFn: async () => (await getPortalApi()).me(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Configuration & Diagnostics"
        title="Settings & Integration Status"
        description="Inspect clinic configuration, backend API connectivity, Supabase authentication, and Vapi voice adapter status."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Clinic Profile */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary-soft" />
              <h2 className="text-sm font-semibold text-ink">
                Clinic Configuration
              </h2>
            </div>
            <Badge tone="teal">Active</Badge>
          </div>
          <dl className="space-y-3 text-xs">
            <div className="flex justify-between">
              <dt className="text-ink-subtle">Clinic Name</dt>
              <dd className="font-medium text-ink">
                {meQuery.data?.clinic.name ?? demoClinic.name} (
                <span className="font-bangla">{demoClinic.nameBn}</span>)
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-subtle">Timezone</dt>
              <dd className="font-mono text-ink">
                {meQuery.data?.clinic.timezone ?? demoClinic.timezone}
              </dd>
            </div>
            <div>
              <dt className="text-ink-subtle">Approved Opening Hours (FAQ)</dt>
              <dd className="mt-1 rounded-xl border border-line bg-surface-raised p-2.5 font-bangla text-ink">
                {demoClinic.hoursBn}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Backend & Database Health */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary-soft" />
              <h2 className="text-sm font-semibold text-ink">
                FastAPI & Database Status
              </h2>
            </div>
            <Badge
              tone={
                healthQuery.data?.status === "ok"
                  ? "teal"
                  : healthQuery.isLoading
                    ? "blue"
                    : "amber"
              }
            >
              {healthQuery.data?.status === "ok"
                ? "Healthy"
                : healthQuery.isLoading
                  ? "Checking…"
                  : "Unreachable / Fixtures"}
            </Badge>
          </div>
          <dl className="space-y-3 text-xs">
            <div className="flex justify-between">
              <dt className="text-ink-subtle">Active Data Source</dt>
              <dd className="font-mono text-ink">
                {isFixtureMode ? "Development Fixtures" : "FastAPI HTTP Client"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-subtle">API Base URL</dt>
              <dd className="font-mono text-ink">
                {isApiConfigured ? env.apiBaseUrl : "Not set"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-subtle">Database Connectivity</dt>
              <dd className="font-mono text-ink">
                {healthQuery.data?.database ?? "—"}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Authentication & RLS */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary-soft" />
              <h2 className="text-sm font-semibold text-ink">
                Supabase Auth & Clinic Isolation
              </h2>
            </div>
            <Badge tone={isSupabaseConfigured ? "teal" : "amber"}>
              {isSupabaseConfigured ? "Configured" : "Pending env vars"}
            </Badge>
          </div>
          <p className="text-xs leading-relaxed text-ink-muted">
            Staff sign-in uses Supabase Auth. The FastAPI backend verifies the JWT
            access token and resolves the caller&apos;s <code className="font-mono">clinic_id</code> from
            the <code className="font-mono">profiles</code> table—never trusting a
            client-supplied clinic ID.
          </p>
        </Card>

        {/* Voice Provider Integration */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-primary-soft" />
              <h2 className="text-sm font-semibold text-ink">
                Voice Provider Abstraction
              </h2>
            </div>
            <Badge tone={isVapiConfigured ? "teal" : "amber"}>
              {isVapiConfigured ? "Vapi Keys Present" : "Demo Provider Active"}
            </Badge>
          </div>
          <p className="text-xs leading-relaxed text-ink-muted">
            The call UI communicates exclusively through the typed{" "}
            <code className="font-mono text-primary-soft">VoiceProvider</code>{" "}
            interface. The simulated Bangla demo provider runs out of the box; the
            Vapi adapter and <code className="font-mono">/api/webhooks/vapi</code>{" "}
            endpoint are ready for live voice credentials (see{" "}
            <code className="font-mono">docs/voice-integration.md</code>).
          </p>
        </Card>
      </div>
    </div>
  );
}
