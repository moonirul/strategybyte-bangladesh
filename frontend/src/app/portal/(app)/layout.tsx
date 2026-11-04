import type { Metadata } from "next";
import { Suspense } from "react";
import { QueryProvider } from "@/components/providers/QueryProvider";
import PortalShell from "@/components/portal/PortalShell";

export const metadata: Metadata = {
  title: "Staff Portal",
  robots: { index: false, follow: false },
};

export default function PortalAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <Suspense
        fallback={
          <div className="grid min-h-screen place-items-center bg-canvas text-xs text-ink-muted">
            Loading portal…
          </div>
        }
      >
        <PortalShell>{children}</PortalShell>
      </Suspense>
    </QueryProvider>
  );
}
