"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { demoClinic } from "@/config/demo-clinic";
import { demoCallsApi, type DemoCallSession } from "@/lib/api/demo-calls";
import { isApiConfigured, isVapiConfigured } from "@/lib/env";
import { formatTimestampMs } from "@/lib/format";
import {
  createVoiceProvider,
  supportsTextInput,
  type FinalCallData,
  type TranscriptMessage,
  type VoiceCallStatus,
  type VoiceProvider,
} from "@/providers/voice";
import { Badge, BookingStatusBadge, CallModeBadge } from "@/components/ui/Badge";

interface VoiceModalContextValue {
  openCallModal: (mode?: "demo" | "vapi") => void;
  closeCallModal: () => void;
}

const VoiceModalContext = createContext<VoiceModalContextValue | null>(null);

export function useVoiceModal(): VoiceModalContextValue {
  const ctx = useContext(VoiceModalContext);
  if (!ctx) {
    throw new Error("useVoiceModal must be used inside VoiceCallHost");
  }
  return ctx;
}

export function VoiceCallHost({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [providerKind, setProviderKind] = useState<"demo" | "vapi">("demo");

  const openCallModal = useCallback((kind: "demo" | "vapi" = "demo") => {
    setProviderKind(kind);
    setOpen(true);
  }, []);

  const closeCallModal = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <VoiceModalContext.Provider value={{ openCallModal, closeCallModal }}>
      {children}
      {open && (
        <VoiceCallDialog
          providerKind={providerKind}
          onSwitchProvider={setProviderKind}
          onClose={closeCallModal}
        />
      )}
    </VoiceModalContext.Provider>
  );
}

function VoiceCallDialog({
  providerKind,
  onSwitchProvider,
  onClose,
}: {
  providerKind: "demo" | "vapi";
  onSwitchProvider: (kind: "demo" | "vapi") => void;
  onClose: () => void;
}) {
  const [provider, setProvider] = useState<VoiceProvider>(() =>
    createVoiceProvider(providerKind),
  );
  const [status, setStatus] = useState<VoiceCallStatus>("idle");
  const [speaker, setSpeaker] = useState<"assistant" | "caller" | null>(null);
  const [muted, setMuted] = useState(false);
  const [turns, setTurns] = useState<TranscriptMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [finalData, setFinalData] = useState<FinalCallData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [persistedCallId, setPersistedCallId] = useState<string | null>(null);
  const [persistenceNote, setPersistenceNote] = useState<string | null>(null);

  const sessionRef = useRef<DemoCallSession | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Recreate provider if kind changes
  useEffect(() => {
    const p = createVoiceProvider(providerKind);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProvider(p);
    setStatus("idle");
    setSpeaker(null);
    setTurns([]);
    setSuggestions([]);
    setFinalData(null);
    setErrorMsg(null);
    setPersistedCallId(null);
    setPersistenceNote(null);
    sessionRef.current = null;
  }, [providerKind]);

  // Subscribe to provider events
  useEffect(() => {
    const refreshSuggestions = () => {
      if (supportsTextInput(provider)) {
        setSuggestions(provider.getSuggestedReplies());
      }
    };

    const unsub = provider.subscribeToEvents((ev) => {
      switch (ev.type) {
        case "call.initiated": {
          if (ev.callMode === "demo" && isApiConfigured) {
            demoCallsApi
              .create({ providerCallId: ev.providerCallId, startedAt: ev.at })
              .then((sess) => {
                sessionRef.current = sess;
                setPersistedCallId(sess.callId);
                setPersistenceNote("Connected to FastAPI backend — persisting live turns.");
              })
              .catch(() => {
                sessionRef.current = null;
                setPersistenceNote(
                  "Backend API unreachable — running in local browser simulation.",
                );
              });
          } else if (ev.callMode === "demo") {
            setPersistenceNote(
              "Running in local browser simulation (configure NEXT_PUBLIC_API_BASE_URL to persist to Supabase).",
            );
          }
          break;
        }
        case "connection.changed":
          setStatus(ev.status);
          refreshSuggestions();
          break;
        case "speaker.changed":
          setSpeaker(ev.speaker);
          break;
        case "transcript.message":
          setTurns((prev) => {
            const exists = prev.some(
              (t) => t.sequenceNumber === ev.message.sequenceNumber,
            );
            return exists ? prev : [...prev, ev.message];
          });
          refreshSuggestions();
          if (ev.message.isFinal && sessionRef.current) {
            demoCallsApi
              .appendTurns(sessionRef.current, [ev.message])
              .catch(() => {
                /* non-fatal during turn streaming; finish() sends full state */
              });
          }
          break;
        case "provider.error":
          setErrorMsg(ev.error.message);
          break;
        case "call.final_data":
          setFinalData(ev.data);
          if (sessionRef.current) {
            demoCallsApi
              .finish(sessionRef.current, ev.data)
              .then((res) => {
                setPersistedCallId(res.callId);
                setPersistenceNote("Saved structured call record to backend.");
              })
              .catch(() => {
                setPersistenceNote(
                  "Call finished locally, but saving to the backend failed.",
                );
              });
          }
          break;
        case "call.ended":
          refreshSuggestions();
          break;
      }
    });

    return () => {
      unsub();
    };
  }, [provider]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [turns, finalData]);

  async function handleStart() {
    setTurns([]);
    setFinalData(null);
    setErrorMsg(null);
    setPersistedCallId(null);
    sessionRef.current = null;
    await provider.startCall();
  }

  async function handleEnd() {
    await provider.endCall();
  }

  function handleSend(text: string) {
    if (!supportsTextInput(provider)) return;
    provider.sendCallerText(text);
    setDraft("");
    setSuggestions(provider.getSuggestedReplies());
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    provider.setMuted(next);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[var(--radius-card)] border border-line-strong bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="voice-modal-title" className="text-base font-semibold text-ink">
                {demoClinic.name} — Bangla Receptionist
              </h2>
              <CallModeBadge mode={provider.callMode} />
            </div>
            <p className="mt-0.5 text-xs text-ink-muted">
              {provider.callMode === "demo"
                ? "Simulated interactive demo — no microphone or external voice credentials required."
                : "Live Vapi voice adapter (requires configured Vapi credentials)."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (status === "active" || status === "connecting") {
                void provider.endCall();
              }
              onClose();
            }}
            aria-label="Close call interface"
            className="rounded-lg p-1.5 text-ink-muted transition hover:bg-surface-hover hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Provider switcher & status bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface-raised/60 px-5 py-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={clsx(
                "h-2 w-2 rounded-full",
                status === "active"
                  ? "bg-primary animate-pulse"
                  : status === "connecting"
                    ? "bg-warning animate-pulse"
                    : status === "error"
                      ? "bg-danger"
                      : "bg-ink-subtle",
              )}
            />
            <span className="font-medium capitalize text-ink">{status}</span>
            {speaker && status === "active" && (
              <span className="text-ink-muted">
                · {speaker === "assistant" ? "Assistant speaking" : "Caller speaking"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onSwitchProvider("demo")}
              className={clsx(
                "rounded-md px-2.5 py-1 font-medium transition",
                providerKind === "demo"
                  ? "bg-primary/20 text-primary-soft ring-1 ring-primary/40"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              Simulated Demo
            </button>
            <button
              type="button"
              onClick={() => onSwitchProvider("vapi")}
              className={clsx(
                "rounded-md px-2.5 py-1 font-medium transition",
                providerKind === "vapi"
                  ? "bg-primary/20 text-primary-soft ring-1 ring-primary/40"
                  : "text-ink-muted hover:text-ink",
              )}
              title={
                isVapiConfigured
                  ? "Vapi keys detected"
                  : "Vapi adapter placeholder (Phase 3/5)"
              }
            >
              Live Vapi {isVapiConfigured ? "" : "(Placeholder)"}
            </button>
          </div>
        </div>

        {/* Body: transcript & call outcome */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {status === "idle" && turns.length === 0 && (
            <div className="rounded-xl border border-line bg-surface-raised/50 p-5 text-sm">
              <p className="font-medium text-ink">
                Try a realistic Bangla reception conversation
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                Start the call below to test appointment requests, Bangla phone number
                validation (e.g., <span className="font-mono">০১৭১২৩৪৫৬৭৮</span>), ambiguous
                time clarification (e.g., <span className="font-bangla">কাল ৫টা</span>), or
                clinic opening-hour FAQs.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleStart}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-canvas shadow-[var(--shadow-glow)] transition hover:bg-primary-hover"
                >
                  <Phone className="h-4 w-4" />
                  Start Bangla Demo Call
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-500/35 bg-rose-950/25 p-4 text-xs text-rose-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
              <div className="space-y-1">
                <p className="font-semibold text-ink">Voice provider notice</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {turns.map((turn) => (
            <div
              key={turn.sequenceNumber}
              className={clsx(
                "flex flex-col gap-1",
                turn.speaker === "caller" ? "items-end" : "items-start",
              )}
            >
              <div className="flex items-center gap-2 text-[11px] text-ink-subtle">
                <span className="font-medium uppercase tracking-wider">
                  {turn.speaker === "assistant" ? "Receptionist (AI)" : "Patient (You)"}
                </span>
                <span className="font-mono">{formatTimestampMs(turn.timestampMs)}</span>
              </div>
              <div
                className={clsx(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed font-bangla",
                  turn.speaker === "caller"
                    ? "bg-primary/20 text-ink ring-1 ring-primary/35"
                    : "bg-surface-raised text-ink ring-1 ring-line",
                )}
              >
                {turn.text}
              </div>
            </div>
          ))}

          {/* Final structured extraction summary */}
          {finalData && (
            <div className="mt-4 rounded-xl border border-primary/35 bg-surface-raised p-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-ink">
                    Structured Call Record Generated
                  </span>
                </div>
                <BookingStatusBadge status={finalData.extraction.bookingStatus} />
              </div>

              <dl className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div>
                  <dt className="text-ink-subtle">Call mode & outcome</dt>
                  <dd className="mt-0.5 font-medium text-ink">
                    {finalData.callMode.toUpperCase()} · {finalData.outcome}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-subtle">Patient name</dt>
                  <dd className="mt-0.5 font-bangla font-medium text-ink">
                    {finalData.extraction.patientName ?? "—"}{" "}
                    {finalData.extraction.patientNameConfirmed && (
                      <Badge tone="teal" className="ml-1">
                        Confirmed
                      </Badge>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-subtle">Phone (E.164 / raw)</dt>
                  <dd className="mt-0.5 font-mono text-ink">
                    {finalData.extraction.phoneE164 ??
                      finalData.extraction.phoneRaw ??
                      "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-subtle">Visit reason</dt>
                  <dd className="mt-0.5 font-bangla text-ink">
                    {finalData.extraction.reasonForVisit ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-subtle">Spoken time preference</dt>
                  <dd className="mt-0.5 font-bangla text-ink">
                    {finalData.extraction.preferredDateText ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-subtle">Preferred doctor</dt>
                  <dd className="mt-0.5 text-ink">
                    {finalData.extraction.preferredDoctor ?? "No preference"}
                  </dd>
                </div>
              </dl>

              {finalData.extraction.requiresHumanFollowup && (
                <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-200">
                  Flagged for human follow-up: {finalData.extraction.followupReason}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
                <span className="text-[11px] text-ink-muted">
                  {persistenceNote ??
                    "Appointment requests remain unconfirmed until clinic staff schedule them."}
                </span>
                <Link
                  href={
                    persistedCallId
                      ? `/portal/calls/${persistedCallId}`
                      : "/portal/calls"
                  }
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-canvas transition hover:bg-primary-hover"
                >
                  Inspect in Staff Portal
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Composer & Call Controls */}
        <div className="border-t border-line bg-surface-raised/80 p-4">
          {status === "active" && supportsTextInput(provider) && (
            <div className="mb-3 space-y-2.5">
              {suggestions.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] text-ink-subtle">
                    <Sparkles className="h-3 w-3 text-primary-soft" />
                    Quick replies:
                  </span>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSend(s)}
                      className="rounded-full border border-line-strong bg-surface px-3 py-1 font-bangla text-xs text-ink transition hover:border-primary hover:text-primary-soft"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (draft.trim()) handleSend(draft);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="বাংলায় বা ইংরেজিতে উত্তর লিখুন… (Type caller response)"
                  className="flex-1 rounded-xl border border-line-strong bg-canvas px-3.5 py-2 font-bangla text-sm text-ink placeholder:text-ink-subtle focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-canvas transition hover:bg-primary-hover disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send
                </button>
              </form>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {status === "active" || status === "connecting" ? (
                <>
                  <button
                    type="button"
                    onClick={handleEnd}
                    className="inline-flex items-center gap-2 rounded-full bg-danger px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                  >
                    <PhoneOff className="h-3.5 w-3.5" />
                    End call
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-pressed={muted}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3.5 py-2 text-xs font-medium text-ink transition hover:border-primary"
                  >
                    {muted ? (
                      <>
                        <MicOff className="h-3.5 w-3.5 text-warning" />
                        Muted
                      </>
                    ) : (
                      <>
                        <Mic className="h-3.5 w-3.5 text-primary-soft" />
                        Mute
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleStart}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-canvas transition hover:bg-primary-hover"
                >
                  {status === "ended" || status === "error" ? (
                    <>
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restart Demo Call
                    </>
                  ) : (
                    <>
                      <Phone className="h-3.5 w-3.5" />
                      Start Call
                    </>
                  )}
                </button>
              )}
            </div>

            <span className="text-[11px] text-ink-subtle">
              Provider: <strong className="text-ink-muted">{provider.label}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TalkToBanglaCallerButton({
  label = "Talk to our Bangla caller",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const { openCallModal } = useVoiceModal();
  return (
    <button
      type="button"
      onClick={() => openCallModal("demo")}
      className={clsx(
        "relative inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-canvas shadow-[var(--shadow-glow)] transition hover:bg-primary-hover",
        className,
      )}
    >
      <Phone className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
