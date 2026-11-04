"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, ArrowRight, Loader2, Lock } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isFixtureMode, isSupabaseConfigured } from "@/lib/env";

const loginSchema = z.object({
  email: z.string().email("Enter a valid staff email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setAuthError(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setAuthError(
        "Supabase Auth is not configured yet. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local (see README).",
      );
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email.trim(),
      password: values.password,
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    router.replace("/portal");
    router.refresh();
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-line-strong bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary";

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-center">
        <Logo />
      </div>

      <div className="mt-7 rounded-[var(--radius-card)] border border-line bg-surface p-7 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 text-primary-soft">
          <Lock className="h-4 w-4" />
          <h1 className="text-lg font-semibold text-ink">Clinic Staff Sign In</h1>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-ink-muted">
          Sign in with your Supabase-verified clinic staff account to review call
          records, transcripts, appointments, and follow-up queues.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-ink">
              Staff Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="staff@clinic.example"
              {...register("email")}
              className={inputClass}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              className={inputClass}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-danger">{errors.password.message}</p>
            )}
          </div>

          {authError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-500/35 bg-rose-950/25 p-3 text-xs text-rose-200"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-canvas shadow-[var(--shadow-glow)] transition hover:bg-primary-hover disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Sign in with Supabase Auth</span>
          </button>
        </form>
      </div>

      {!isSupabaseConfigured && (
        <div className="mt-4 rounded-2xl border border-line bg-surface-raised/80 p-4 text-xs text-ink-muted">
          <p className="font-semibold text-ink">Supabase Auth Configuration</p>
          <p className="mt-1 leading-relaxed">
            No hardcoded password exists in this repository. Create your reviewer
            account in Supabase Auth and link it to a clinic profile using{" "}
            <code className="font-mono text-primary-soft">backend/migrations/seed.sql</code>.
          </p>
          {isFixtureMode && (
            <div className="mt-3 border-t border-line pt-3">
              <p className="text-amber-300">
                Development fixture mode (<code className="font-mono">NEXT_PUBLIC_DATA_SOURCE=fixtures</code>) is active for local UI inspection:
              </p>
              <Link
                href="/portal"
                className="mt-2 inline-flex items-center gap-1.5 font-semibold text-primary-soft underline underline-offset-4"
              >
                <span>Preview Portal with Development Fixtures</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
