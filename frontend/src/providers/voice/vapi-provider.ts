import {
  VoiceEventEmitter,
  type VoiceCallStatus,
  type VoiceEventListener,
  type VoiceProvider,
} from "./types";

/**
 * PLACEHOLDER — not implemented yet (Priority 3).
 *
 * Integration plan (see docs/voice-integration.md):
 *  1. `npm install @vapi-ai/web` and verify the current SDK API in the official docs.
 *  2. In startCall(), create the SDK client with NEXT_PUBLIC_VAPI_PUBLIC_KEY and
 *     start the assistant NEXT_PUBLIC_VAPI_ASSISTANT_ID. Only the *public* key is
 *     used in the browser; the private key stays on the backend.
 *  3. Map SDK events to VoiceEvent:
 *       call start          -> call.initiated + connection.changed("active")
 *       transcript messages -> transcript.message (isFinal from transcript type)
 *       speech start/end    -> speaker.changed
 *       call end            -> call.ended
 *       errors              -> provider.error
 *  4. Final structured data arrives server-side via POST /api/webhooks/vapi
 *     (end-of-call report), verified with the webhook secret — so this adapter
 *     does not need to emit call.final_data for persistence.
 *
 * Until then this class reports a clear, non-retryable error instead of
 * pretending to connect.
 */
export class VapiVoiceProvider implements VoiceProvider {
  readonly id = "vapi" as const;
  readonly callMode = "live" as const;
  readonly label = "Live voice (Vapi)";

  private events = new VoiceEventEmitter();
  private status: VoiceCallStatus = "idle";

  getStatus() {
    return this.status;
  }

  subscribeToEvents(listener: VoiceEventListener) {
    return this.events.subscribe(listener);
  }

  setMuted() {}

  async startCall() {
    this.status = "error";
    this.events.emit({ type: "connection.changed", status: "error" });
    this.events.emit({
      type: "provider.error",
      error: {
        code: "not_implemented",
        message: "The Vapi adapter has not been implemented yet. Use the simulated demo.",
        retryable: false,
      },
    });
  }

  async endCall() {
    this.status = "ended";
    this.events.emit({ type: "connection.changed", status: "ended" });
  }
}
