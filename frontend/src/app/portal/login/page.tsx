import type { Metadata } from "next";
import LoginForm from "@/components/portal/LoginForm";

export const metadata: Metadata = {
  title: "Staff Sign In",
  robots: { index: false, follow: false },
};

export default function PortalLoginPage() {
  return (
    <main className="relative grid min-h-screen place-items-center px-6 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]"
      />
      <LoginForm />
    </main>
  );
}
