import Link from "next/link";
import clsx from "clsx";

export function Logo({
  href = "/",
  subtitle = "Bangladesh",
  className,
}: {
  href?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center gap-2.5 font-semibold tracking-tight text-ink transition hover:opacity-90",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid h-8 w-8 place-items-center rounded-lg border border-primary/40 bg-gradient-to-br from-primary/25 to-accent/15 font-mono text-xs font-bold text-primary-soft shadow-sm"
      >
        BV
      </span>
      <span className="flex items-baseline gap-1.5">
        <span>ByteVoice</span>
        {subtitle && (
          <span className="text-xs font-medium tracking-normal text-ink-muted">
            {subtitle}
          </span>
        )}
      </span>
    </Link>
  );
}
