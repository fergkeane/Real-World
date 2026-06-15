/* Toast / Snackbar — full specification for the Skytek Design System spec page.
   Canonical component name is "Toast"; "Snackbar" is the documented alias.
   Renders a live, self-contained toast manager (window.SkytekToast) so every
   demo below fires the real component into a fixed top-center region. */

const TOAST_TONES = {
  info:    { icon: I.info,  role: "status", live: "polite",    dur: "var(--toast-dur-short)" },
  success: { icon: I.check, role: "status", live: "polite",    dur: "var(--toast-dur-short)" },
  warning: { icon: I.warn,  role: "status", live: "polite",    dur: "var(--toast-dur-long)" },
  danger:  { icon: I.alert, role: "alert",  live: "assertive", dur: "0" },
};

/* ---- One live toast row: owns its own auto-dismiss timer + pause-on-hover ---- */
const ToastItem = ({ t, onClose }) => {
  const [leaving, setLeaving] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const timer = React.useRef(null);
  const started = React.useRef(0);
  const left = React.useRef(t.duration);

  const dismiss = React.useCallback(() => {
    setLeaving(true);
    window.setTimeout(() => onClose(t.id), 150);
  }, [t.id, onClose]);

  const clear = () => { if (timer.current) { window.clearTimeout(timer.current); timer.current = null; } };
  const arm = (ms) => {
    clear();
    if (!ms || ms === Infinity || t.loading) return;       // persistent / loading toasts never auto-close
    started.current = Date.now();
    timer.current = window.setTimeout(dismiss, ms);
  };

  React.useEffect(() => { arm(t.duration); return clear; }, [t.duration, t.loading]);

  const pause = () => {
    if (!timer.current) return;
    left.current = Math.max(0, left.current - (Date.now() - started.current));
    clear(); setPaused(true);
  };
  const resume = () => { if (paused) { setPaused(false); arm(left.current); } };

  const tone = TOAST_TONES[t.tone] || TOAST_TONES.info;
  const showTimer = !t.loading && t.duration && t.duration !== Infinity;

  return (
    <div
      className={`ds-toast ds-toast--${t.tone} ${leaving ? "is-leaving" : "is-entering"} ${paused ? "is-paused" : ""}`}
      role={tone.role}
      aria-live={tone.live}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      {t.loading
        ? <span className="ds-toast-spinner" aria-hidden="true" />
        : <Icon d={tone.icon} size={18} className="ds-toast-icon" />}
      <div className="ds-toast-body">
        <div className="ds-toast-title">{t.title}</div>
        {t.desc && <div className="ds-toast-desc">{t.desc}</div>}
        {t.action && (
          <div className="ds-toast-actions">
            <button
              className="ds-btn ds-btn--link ds-btn--sm"
              style={{ height: 24, padding: "0 4px" }}
              onClick={() => { t.action.onClick?.(); dismiss(); }}
            >{t.action.label}</button>
          </div>
        )}
      </div>
      <div className="ds-toast-side">
        <button className="ds-toast-dismiss" aria-label="Dismiss notification" onClick={dismiss}>
          <Icon d={I.x} size={14} />
        </button>
      </div>
      {showTimer && (
        <span
          className="ds-toast-timer"
          style={{ animationDuration: `${t.duration}ms` }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

/* ---- The manager: holds the queue, renders the fixed region into <body> ---- */
const DUR = { short: 4000, long: 6000, action: 8000 };

const useToastManager = () => {
  const [toasts, setToasts] = React.useState([]);
  const seq = React.useRef(0);

  const close = React.useCallback((id) => setToasts(ts => ts.filter(x => x.id !== id)), []);
  const update = React.useCallback((id, patch) =>
    setToasts(ts => ts.map(x => x.id === id ? { ...x, ...patch } : x)), []);
  const push = React.useCallback((opts) => {
    const id = ++seq.current;
    setToasts(ts => {
      const next = [{ id, tone: "info", duration: DUR.short, ...opts }, ...ts];
      return next.slice(0, 4); // cap rendered stack; oldest beyond cap drop
    });
    return id;
  }, []);

  return { toasts, push, update, close };
};

const ToastRegion = ({ toasts, onClose, inline }) => {
  const [host] = React.useState(() => {
    if (typeof document === "undefined") return null;
    const el = document.createElement("div");
    return el;
  });
  React.useEffect(() => {
    if (!host || inline) return;
    document.body.appendChild(host);
    return () => { try { document.body.removeChild(host); } catch (e) {} };
  }, [host, inline]);

  const region = (
    <div className={`ds-toast-region ${inline ? "is-inline" : ""}`} aria-label="Notifications">
      {toasts.map(t => <ToastItem key={t.id} t={t} onClose={onClose} />)}
    </div>
  );
  if (inline) return region;
  return host ? ReactDOM.createPortal(region, host) : null;
};

/* =========================== THE SPEC SECTION =========================== */
const ToastSpec = () => {
  const { toasts, push, update, close } = useToastManager();

  // expose a real, reusable API on window (mirrors RWModal)
  React.useEffect(() => {
    window.SkytekToast = {
      show: push,
      info:    (o) => push({ tone: "info", ...o }),
      success: (o) => push({ tone: "success", ...o }),
      warning: (o) => push({ tone: "warning", duration: DUR.long, ...o }),
      error:   (o) => push({ tone: "danger", duration: Infinity, ...o }),
      dismiss: close,
    };
  }, [push, close]);

  const demoUndo = () => {
    push({
      tone: "success",
      title: "23 vessels archived",
      desc: "Moved to archive · undo within 8 s",
      duration: DUR.action,
      action: { label: "Undo", onClick: () => push({ tone: "info", title: "Archive reverted", desc: "23 vessels restored to the active list." }) },
    });
  };

  const demoPromise = () => {
    const id = push({ tone: "info", loading: true, title: "Saving policy #44721…", duration: Infinity });
    window.setTimeout(() => update(id, {
      loading: false, tone: "success", title: "Policy saved",
      desc: "Added to Atlantic Hull Programme 2026.", duration: DUR.short,
    }), 1800);
  };

  const demoStack = () => {
    ["North Atlantic", "Black Sea", "Gulf of Aden", "Malacca Strait"].forEach((r, i) =>
      window.setTimeout(() => push({ tone: "info", title: `${r} feed refreshed`, desc: "Positions updated." }), i * 320));
  };

  return (
    <>
      {/* live region for all demos */}
      <ToastRegion toasts={toasts} onClose={close} />

      {/* alias note */}
      <div className="callout" style={{ marginBottom: 24 }}>
        <strong>Naming.</strong> The canonical component is <strong>Toast</strong> — that's the name in code
        (<code className="inline">useToast()</code>), the z-index token (<code className="inline">--z-toast</code>),
        and the Figma frame. <strong>“Snackbar”</strong> is an accepted alias for the same component; prefer
        “Toast” in specs and PRs so search stays consistent. A toast is <em>transient</em> feedback that confirms an
        action just happened — it is not the <a href="#c-alerts" style={{ color: "var(--brand-600)", fontWeight: 600 }}>Alert</a> (persistent, in-surface) and not a <a href="#c-modal" style={{ color: "var(--brand-600)", fontWeight: 600 }}>Modal</a> (blocking).
      </div>

      {/* ====== LIVE DEMOS ====== */}
      <div className="subsection">
        <h3 className="subsection-title">Live behavior</h3>
        <p className="subsection-desc">Every button fires the production component into the fixed region at the <strong>top-center of the viewport</strong>. Hover or focus a toast to pause its countdown; the timer bar resumes on leave. Newest stacks on top; only <code className="inline">--toast-max-stack</code> (3) stay visible.</p>
        <div className="panel" style={{ padding: 20 }}>
          <div className="ts-demo-row">
            <div className="ts-demo-grp">
              <span className="t-overline">Tones</span>
              <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                <button className="ds-btn ds-btn--secondary ds-btn--sm" onClick={() => push({ tone: "info", title: "View saved", desc: "“Black Sea — High Risk” is now in your saved views." })}>Info</button>
                <button className="ds-btn ds-btn--secondary ds-btn--sm" onClick={() => push({ tone: "success", title: "Policy saved", desc: "Policy #44721 added to the programme." })}>Success</button>
                <button className="ds-btn ds-btn--secondary ds-btn--sm" onClick={() => push({ tone: "warning", duration: DUR.long, title: "AIS feed unstable", desc: "Some positions may be stale. Last full update 8 min ago." })}>Warning</button>
                <button className="ds-btn ds-btn--secondary ds-btn--sm" onClick={() => push({ tone: "danger", duration: Infinity, title: "Couldn’t save policy", desc: "Another user updated this 12 s ago. Refresh to see the latest.", action: { label: "Refresh" } })}>Danger</button>
              </div>
            </div>
            <div className="ts-demo-grp">
              <span className="t-overline">Patterns</span>
              <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                <button className="ds-btn ds-btn--secondary ds-btn--sm" onClick={demoUndo}>With undo · 8 s</button>
                <button className="ds-btn ds-btn--secondary ds-btn--sm" onClick={demoPromise}>Loading → resolve</button>
                <button className="ds-btn ds-btn--secondary ds-btn--sm" onClick={demoStack}>Burst (stacking)</button>
                <button className="ds-btn ds-btn--ghost ds-btn--sm" onClick={() => toasts.forEach(t => close(t.id))}>Clear all</button>
              </div>
            </div>
          </div>
        </div>
        <div className="callout" style={{ marginTop: 16 }}>
          <strong>Try it from the console.</strong> The demo registers the real API on <code className="inline">window.SkytekToast</code> — e.g. <code className="inline">{"SkytekToast.success({ title: 'Done' })"}</code> or <code className="inline">{"SkytekToast.error({ title: 'Failed' })"}</code>.
        </div>
      </div>

      {/* ====== WHEN TO USE ====== */}
      <div className="subsection">
        <h3 className="subsection-title">When to use a toast</h3>
        <p className="subsection-desc">Reach for a toast only to confirm a completed action or surface a low-stakes, transient status. If the user must act, or the message must persist, it isn’t a toast.</p>
        <div className="panel" style={{ overflow: "hidden" }}>
          <table className="spec-table" style={{ border: 0 }}>
            <thead><tr><th>Need</th><th>Use</th><th>Why</th></tr></thead>
            <tbody>
              <tr><td>Confirm an action that just succeeded</td><td><strong>Toast</strong></td><td className="t-caption">Transient, non-blocking, self-dismissing. “Policy saved.”</td></tr>
              <tr><td>Offer to reverse a just-done action</td><td><strong>Toast + Undo</strong></td><td className="t-caption">8 s window; the only action a toast should carry.</td></tr>
              <tr><td>Persistent condition on the current surface</td><td><a href="#c-alerts" style={{ color: "var(--brand-600)", fontWeight: 600 }}>Alert / banner</a></td><td className="t-caption">Stays until resolved; lives in the layout, not over it.</td></tr>
              <tr><td>A decision that blocks progress</td><td><a href="#c-modal" style={{ color: "var(--brand-600)", fontWeight: 600 }}>Modal</a></td><td className="t-caption">Requires focus + an explicit choice.</td></tr>
              <tr><td>Field-level validation error</td><td>Inline message</td><td className="t-caption">Lives under the field — never a toast.</td></tr>
            </tbody>
          </table>
        </div>
        <div className="dodont" style={{ marginTop: 16 }}>
          <div>
            <div className="dd-head dd-do">Do</div>
            <ul className="dd-list">
              <li>One line of outcome, sentence case, no terminal period unless multi-sentence.</li>
              <li>At most one action, and only Undo / Retry / View.</li>
              <li>Let success &amp; info self-dismiss; keep errors until dismissed.</li>
            </ul>
          </div>
          <div>
            <div className="dd-head dd-dont">Don’t</div>
            <ul className="dd-list">
              <li>Put critical errors or anything requiring a decision in a toast.</li>
              <li>Stack two CTAs, or use a toast for marketing / tips.</li>
              <li>Fire a toast for every keystroke or for routine, expected results.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ====== ANATOMY ====== */}
      <div className="subsection">
        <h3 className="subsection-title">Anatomy</h3>
        <p className="subsection-desc">A 4-px tone bar encodes intent; the surface stays neutral white for legibility against any backdrop. Five regions, all optional except title.</p>
        <div className="panel" style={{ padding: 24, background: "var(--bg-app)" }}>
          <div style={{ position: "relative", width: 380, maxWidth: "100%" }}>
            <div className="ds-toast ds-toast--success" style={{ animation: "none" }}>
              <Icon d={I.check} size={18} className="ds-toast-icon" />
              <div className="ds-toast-body">
                <div className="ds-toast-title">23 vessels archived</div>
                <div className="ds-toast-desc">Moved to archive · undo within 8 s</div>
                <div className="ds-toast-actions"><button className="ds-btn ds-btn--link ds-btn--sm" style={{ height: 24, padding: "0 4px" }}>Undo</button></div>
              </div>
              <div className="ds-toast-side"><span className="ds-toast-dismiss" aria-hidden="true"><Icon d={I.x} size={14} /></span></div>
              <span className="ds-toast-timer" style={{ width: "100%", transform: "scaleX(0.55)", animation: "none" }} aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="panel" style={{ overflow: "hidden", marginTop: 16 }}>
          <table className="spec-table" style={{ border: 0 }}>
            <thead><tr><th style={{ width: 28 }}>#</th><th>Region</th><th>Class</th><th>Responsibility</th></tr></thead>
            <tbody>
              <tr><td>1</td><td><strong>Tone bar</strong></td><td><code className="inline">border-left</code></td><td className="t-caption">4-px accent in the tone color — the only chromatic element.</td></tr>
              <tr><td>2</td><td><strong>Icon</strong></td><td><code className="inline">.ds-toast-icon</code></td><td className="t-caption">18-px Lucide glyph in tone-700, or a spinner for loading toasts.</td></tr>
              <tr><td>3</td><td><strong>Body</strong></td><td><code className="inline">.ds-toast-body</code></td><td className="t-caption">Title (13 px / 600) and optional one-line description (12 px muted).</td></tr>
              <tr><td>4</td><td><strong>Action</strong></td><td><code className="inline">.ds-toast-actions</code></td><td className="t-caption">Optional single link button — Undo / Retry / View only.</td></tr>
              <tr><td>5</td><td><strong>Dismiss + timer</strong></td><td><code className="inline">.ds-toast-dismiss</code> · <code className="inline">.ds-toast-timer</code></td><td className="t-caption">24-px close target; 2-px bar depletes over the auto-dismiss duration.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ====== VARIANTS & TIMING ====== */}
      <div className="subsection">
        <h3 className="subsection-title">Variants &amp; timing</h3>
        <p className="subsection-desc">Four tones, mapped to the same status families as Alerts. Duration scales with how much the user needs to read — and errors never auto-close.</p>
        <div className="panel" style={{ overflow: "hidden" }}>
          <table className="spec-table" style={{ border: 0 }}>
            <thead><tr><th>Tone</th><th>Use for</th><th>Default duration</th><th>ARIA</th><th>Auto-dismiss</th></tr></thead>
            <tbody>
              <tr><td><span className="ds-badge ds-badge--info ds-badge--dot">info</span></td><td className="t-caption">Neutral confirmation, background status</td><td><code className="inline">--toast-dur-short</code> · 4 s</td><td className="t-caption">role=status · polite</td><td>Yes</td></tr>
              <tr><td><span className="ds-badge ds-badge--success ds-badge--dot">success</span></td><td className="t-caption">Action completed</td><td><code className="inline">--toast-dur-short</code> · 4 s</td><td className="t-caption">role=status · polite</td><td>Yes</td></tr>
              <tr><td><span className="ds-badge ds-badge--warning ds-badge--dot">warning</span></td><td className="t-caption">Degraded but non-blocking state</td><td><code className="inline">--toast-dur-long</code> · 6 s</td><td className="t-caption">role=status · polite</td><td>Yes</td></tr>
              <tr><td><span className="ds-badge ds-badge--danger ds-badge--dot">danger</span></td><td className="t-caption">Action failed / needs attention</td><td><strong>Persistent</strong></td><td className="t-caption">role=alert · assertive</td><td>No — manual</td></tr>
              <tr style={{ background: "var(--brand-050)" }}><td><strong>any + action</strong></td><td className="t-caption">Carries Undo / Retry</td><td><code className="inline">--toast-dur-action</code> · 8 s</td><td className="t-caption">inherits tone</td><td>Yes (longer)</td></tr>
              <tr><td><strong>loading</strong></td><td className="t-caption">Promise in flight (→ resolves in place)</td><td><strong>Persistent</strong></td><td className="t-caption">role=status · polite</td><td>On settle</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ====== PLACEMENT & STACKING ====== */}
      <div className="subsection">
        <h3 className="subsection-title">Placement &amp; stacking</h3>
        <p className="subsection-desc">One region per app, never more. It sits above modals so confirmations remain visible during a flow.</p>
        <div className="grid-2">
          <div className="callout"><strong>Anchor.</strong> Fixed <strong>top-center</strong>, <code className="inline">--toast-inset</code> (20 px) from the top edge and horizontally centered, at <code className="inline">--z-toast</code> (1200) — above the modal layer.</div>
          <div className="callout"><strong>Stack order.</strong> Newest enters at the top and pushes older ones down. Max <code className="inline">--toast-max-stack</code> (3) visible; extras queue and appear as room frees up.</div>
          <div className="callout"><strong>Width.</strong> <code className="inline">--toast-width</code> (380 px), capped to the viewport on small screens — full-bleed minus 16 px gutters on phones.</div>
          <div className="callout"><strong>Pointer.</strong> The region is click-through (<code className="inline">pointer-events: none</code>); each toast re-enables pointer events so the page underneath stays usable.</div>
        </div>
        <div className="callout warn" style={{ marginTop: 12 }}>
          <strong>Mobile.</strong> Below 640 px the region spans the top gutter-to-gutter; reserve bottom placement for views with a fixed bottom action bar, and move the toast above it so it never covers the primary CTA.
        </div>
      </div>

      {/* ====== API ====== */}
      <div className="subsection">
        <h3 className="subsection-title">API</h3>
        <p className="subsection-desc">A single imperative hook returns the trigger functions; tone helpers are sugar over <code className="inline">toast(opts)</code>. Promise toasts mutate in place rather than spawning a second toast.</p>
        <pre className="code">{`const toast = useToast();

// Sugar — tone is implied
toast.success({ title: 'Policy saved', description: 'Added to Atlantic Hull 2026.' });
toast.error({ title: "Couldn't save policy", description: 'Refresh to see the latest.' });

// Reversible action — the only time a toast carries a button
toast.success({
  title: '23 vessels archived',
  action: { label: 'Undo', onClick: restore },
  duration: 8000,
});

// Promise — one toast: loading → success | error
toast.promise(savePolicy(id), {
  loading: 'Saving policy…',
  success: (p) => ({ title: 'Policy saved', description: \`#\${p.id} added.\` }),
  error:   'Could not save — try again.',
});`}</pre>
        <div className="panel" style={{ overflow: "hidden", marginTop: 16 }}>
          <table className="spec-table" style={{ border: 0 }}>
            <thead><tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code className="inline">title</code></td><td className="t-caption">string</td><td>—</td><td className="t-caption">Required. The single-line outcome.</td></tr>
              <tr><td><code className="inline">description</code></td><td className="t-caption">string</td><td>—</td><td className="t-caption">Optional second line of context.</td></tr>
              <tr><td><code className="inline">tone</code></td><td className="t-caption">'info'|'success'|'warning'|'danger'</td><td><code className="inline">'info'</code></td><td className="t-caption">Sets icon, bar color and ARIA role.</td></tr>
              <tr><td><code className="inline">duration</code></td><td className="t-caption">number (ms) | Infinity</td><td className="t-caption">4000 / 6000</td><td className="t-caption"><code className="inline">Infinity</code> = persistent (auto for <code className="inline">danger</code>).</td></tr>
              <tr><td><code className="inline">action</code></td><td className="t-caption">&#123; label, onClick &#125;</td><td>—</td><td className="t-caption">One button only. Dismisses the toast on click.</td></tr>
              <tr><td><code className="inline">dismissible</code></td><td className="t-caption">boolean</td><td><code className="inline">true</code></td><td className="t-caption">Show the × close target.</td></tr>
              <tr><td><code className="inline">id</code></td><td className="t-caption">string</td><td>auto</td><td className="t-caption">Pass to dedupe / update an existing toast.</td></tr>
              <tr><td><code className="inline">onDismiss</code></td><td className="t-caption">fn</td><td>—</td><td className="t-caption">Fires when removed (timeout, action, or ×).</td></tr>
            </tbody>
          </table>
        </div>
        <p className="subsection-desc" style={{ marginTop: 16 }}>Returns and controls: <code className="inline">const id = toast(opts)</code>, then <code className="inline">toast.dismiss(id)</code> or <code className="inline">toast.update(id, patch)</code>. <code className="inline">toast.dismiss()</code> with no id clears the queue.</p>
      </div>

      {/* ====== TOKENS ====== */}
      <div className="subsection">
        <h3 className="subsection-title">Design tokens</h3>
        <p className="subsection-desc">Every dimension reads from a <code className="inline">--toast-*</code> variable. Override on <code className="inline">:root</code> to re-theme placement, density or timing without touching markup.</p>
        <div className="panel" style={{ overflow: "hidden" }}>
          <table className="spec-table" style={{ border: 0 }}>
            <thead><tr><th>Token</th><th>Default</th><th>Controls</th></tr></thead>
            <tbody>
              <tr><td><code className="inline">--z-toast</code></td><td className="t-caption">1200</td><td className="t-caption">Stack order — above modals</td></tr>
              <tr><td><code className="inline">--toast-width</code></td><td className="t-caption">380px</td><td className="t-caption">Toast / region width</td></tr>
              <tr><td><code className="inline">--toast-inset</code></td><td className="t-caption">20px</td><td className="t-caption">Distance from the top edge</td></tr>
              <tr><td><code className="inline">--toast-gap</code></td><td className="t-caption">12px</td><td className="t-caption">Vertical gap between stacked toasts</td></tr>
              <tr><td><code className="inline">--toast-radius</code></td><td className="t-caption">var(--radius-lg)</td><td className="t-caption">Corner roundness</td></tr>
              <tr><td><code className="inline">--toast-shadow</code></td><td className="t-caption">card-shadow-raised</td><td className="t-caption">Elevation</td></tr>
              <tr><td><code className="inline">--toast-accent</code></td><td className="t-caption">4px</td><td className="t-caption">Tone-bar thickness</td></tr>
              <tr><td><code className="inline">--toast-pad-x / -pad-y</code></td><td className="t-caption">14px / 12px</td><td className="t-caption">Inner padding</td></tr>
              <tr><td><code className="inline">--toast-max-stack</code></td><td className="t-caption">3</td><td className="t-caption">Visible before queueing</td></tr>
              <tr><td><code className="inline">--toast-dur-short / -long / -action</code></td><td className="t-caption">4s / 6s / 8s</td><td className="t-caption">Auto-dismiss timings</td></tr>
              <tr><td><code className="inline">--toast-motion · --toast-ease</code></td><td className="t-caption">200ms · ease-out</td><td className="t-caption">Enter animation</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ====== ACCESSIBILITY ====== */}
      <div className="subsection">
        <h3 className="subsection-title">Accessibility</h3>
        <p className="subsection-desc">A toast appears without stealing focus, so it must announce itself and survive long enough to be read.</p>
        <div className="grid-2">
          <div className="callout"><strong>Live regions.</strong> Info / success / warning use <code className="inline">role="status"</code> + <code className="inline">aria-live="polite"</code>; danger uses <code className="inline">role="alert"</code> + <code className="inline">aria-live="assertive"</code>.</div>
          <div className="callout"><strong>No focus theft.</strong> Toasts never move focus or trap it — they overlay without interrupting the user’s current task.</div>
          <div className="callout"><strong>Pause on interaction.</strong> Hover and keyboard focus pause the countdown (WCAG 2.2.1) so the message can’t expire while being read or acted on.</div>
          <div className="callout"><strong>Reachable dismiss.</strong> The × is a real 24-px button in the tab order; the optional action is a focusable button, both with a visible focus ring.</div>
          <div className="callout"><strong>Min duration.</strong> Auto-dismiss never falls below 4 s; toasts with an action get 8 s so the control is reachable in time.</div>
          <div className="callout"><strong>Reduced motion.</strong> Enter / exit slides and the timer bar collapse under <code className="inline">prefers-reduced-motion</code> — content simply appears.</div>
        </div>
      </div>

      <style>{`
        .ts-demo-row { display: flex; flex-wrap: wrap; gap: 28px; }
        .ts-demo-grp { display: flex; flex-direction: column; gap: 8px; }
        .dodont { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .dodont > div { border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; padding: 0; }
        .dd-head { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 10px 16px; }
        .dd-do   { background: var(--success-050); color: var(--success-700); }
        .dd-dont { background: var(--danger-050); color: var(--danger-700); }
        .dd-list { margin: 0; padding: 12px 16px 14px 32px; font-size: 13px; line-height: 1.6; color: var(--text-primary); }
        .dd-list li { margin-bottom: 4px; }
        @media (max-width: 720px) { .dodont { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
};

Object.assign(window, { ToastSpec });
