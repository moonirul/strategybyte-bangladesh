import assert from "node:assert/strict";
import { describe, it } from "node:test";
import fs from "node:fs";
import path from "node:path";

describe("ByteVoice Bangladesh — Frontend Acceptance & Contract Checks", () => {
  const srcRoot = path.resolve(import.meta.dirname, "../src");

  it("exposes required landing page sections and exact hero copy", () => {
    const heroSource = fs.readFileSync(
      path.join(srcRoot, "components/landing/Hero.tsx"),
      "utf8",
    );
    assert.ok(heroSource.includes("Every patient call deserves an answer."));
    assert.ok(
      heroSource.includes(
        "আপনার ক্লিনিকের প্রতিটি কলের উত্তর দিন—সহজ, স্বাভাবিক বাংলায়।",
      ),
    );
  });

  it("includes WebGL fallback, reduced-motion support, and off-screen observer in HeroSceneLoader", () => {
    const loaderSource = fs.readFileSync(
      path.join(srcRoot, "components/three/HeroSceneLoader.tsx"),
      "utf8",
    );
    assert.ok(loaderSource.includes("detectWebGL"));
    assert.ok(loaderSource.includes("prefers-reduced-motion: reduce"));
    assert.ok(loaderSource.includes("IntersectionObserver"));
    assert.ok(loaderSource.includes("CssVoiceFallback"));
  });

  it("implements the provider-independent VoiceProvider contract and demo + Vapi adapters", () => {
    const typesSource = fs.readFileSync(
      path.join(srcRoot, "providers/voice/types.ts"),
      "utf8",
    );
    for (const method of [
      "startCall()",
      "endCall()",
      "setMuted(",
      "getStatus()",
      "subscribeToEvents(",
    ]) {
      assert.ok(typesSource.includes(method), `Missing ${method} on VoiceProvider`);
    }
    assert.ok(
      fs.existsSync(path.join(srcRoot, "providers/voice/demo-provider.ts")),
    );
    assert.ok(
      fs.existsSync(path.join(srcRoot, "providers/voice/vapi-provider.ts")),
    );
  });

  it("guards development fixtures from production builds in env.ts and portal-api.ts", () => {
    const envSource = fs.readFileSync(path.join(srcRoot, "lib/env.ts"), "utf8");
    const apiSource = fs.readFileSync(
      path.join(srcRoot, "lib/api/portal-api.ts"),
      "utf8",
    );
    assert.ok(envSource.includes('process.env.NODE_ENV === "production"'));
    assert.ok(apiSource.includes('process.env.NODE_ENV !== "production"'));
  });

  it("contains all required Staff Portal routes", () => {
    const requiredRoutes = [
      "app/portal/login/page.tsx",
      "app/portal/(app)/page.tsx",
      "app/portal/(app)/calls/page.tsx",
      "app/portal/(app)/calls/[callId]/page.tsx",
      "app/portal/(app)/patients/page.tsx",
      "app/portal/(app)/patients/[patientId]/page.tsx",
      "app/portal/(app)/appointments/page.tsx",
      "app/portal/(app)/follow-ups/page.tsx",
      "app/portal/(app)/settings/page.tsx",
    ];
    for (const rel of requiredRoutes) {
      assert.ok(
        fs.existsSync(path.join(srcRoot, rel)),
        `Missing portal route: ${rel}`,
      );
    }
  });
});
