const steps = [
  {
    step: "01",
    title: "A patient speaks naturally in Bangla",
    banglaSample: "“আগামীকাল বিকাল ৫টায় অ্যাপয়েন্টমেন্ট নিতে চাই।”",
    description:
      "Callers describe their visit reason, ask about clinic opening hours, or request a callback in natural Bangla or mixed Bangla-English.",
  },
  {
    step: "02",
    title: "The assistant collects and confirms relevant details",
    banglaSample: "“আপনার নাম, মোবাইল নম্বর এবং পছন্দের সময় নিশ্চিত করছি…”",
    description:
      "ByteVoice validates Bangladeshi mobile numbers, asks clarifying questions when dates or times are ambiguous, and never guesses missing digits.",
  },
  {
    step: "03",
    title: "The clinic receives a structured call record",
    banglaSample: "Portal: Transcript · Extracted Fields · Follow-up Queue",
    description:
      "Reception staff review the full Bangla transcript, extracted visit details, and unconfirmed appointment requests in the portal to confirm scheduling.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 border-b border-line/70 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-soft">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            From patient call to structured clinical record in three steps.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Every conversation follows a transparent lifecycle so reception teams stay
            in control of clinical scheduling.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.step}
              className="flex flex-col justify-between rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-primary-soft">
                    STEP {s.step}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                  {s.description}
                </p>
              </div>
              <div className="mt-6 rounded-xl border border-line bg-surface-raised px-3.5 py-2.5 font-bangla text-xs text-ink-muted">
                {s.banglaSample}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
