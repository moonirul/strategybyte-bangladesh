const TZ = "Asia/Dhaka";

export function formatDuration(totalSec: number | null | undefined): string {
  if (totalSec === null || totalSec === undefined || totalSec < 0) return "—";
  if (totalSec === 0) return "0s";
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return m ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
}

export function formatTimestampMs(ms: number | null | undefined): string {
  if (ms === null || ms === undefined || ms < 0) return "0:00";
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ,
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ,
      day: "2-digit",
      month: "short",
    }).format(new Date(iso.length === 10 ? `${iso}T12:00:00+06:00` : iso));
  } catch {
    return iso;
  }
}

export function formatDay(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", { timeZone: TZ, weekday: "short" }).format(
      new Date(`${isoDate}T12:00:00+06:00`),
    );
  } catch {
    return isoDate;
  }
}
