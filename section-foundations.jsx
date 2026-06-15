/* Section 2 — Foundations: Color, Type, Spacing, Radius/Shadow */

const ColorSwatch = ({ name, token, value, fg = "white" }) => (
  <div className="swatch">
    <div className="swatch-color" style={{ background: value, color: fg, padding: "8px 10px", display: "flex", alignItems: "flex-end" }}>
      <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.85 }}>{name}</span>
    </div>
    <div className="swatch-meta">
      <div className="swatch-token">{token}</div>
      <div className="swatch-hex">{value}</div>
    </div>
  </div>
);

const ColorScale = ({ title, items }) => (
  <div className="subsection">
    <div className="t-label" style={{ marginBottom: 10 }}>{title}</div>
    <div className="grid-6">
      {items.map(it => <ColorSwatch key={it.token} {...it} />)}
    </div>
  </div>
);

const ColorSection = () => {
  const brand = [
    { name: "600", token: "--brand-600", value: "#2d7ffb" },
    { name: "500", token: "--brand-500", value: "#51a2fc" },
    { name: "400", token: "--brand-400", value: "#8ec5fd" },
    { name: "300", token: "--brand-300", value: "#bfdbfe", fg: "#2d7ffb" },
    { name: "100", token: "--brand-100", value: "#dbeafe", fg: "#2d7ffb" },
    { name: "050", token: "--brand-050", value: "#eff6ff", fg: "#2d7ffb" },
  ];
  const slate = [
    { name: "950", token: "--slate-950", value: "#0B1220" },
    { name: "900", token: "--slate-900", value: "#111827" },
    { name: "800", token: "--slate-800", value: "#1F2937" },
    { name: "700", token: "--slate-700", value: "#374151" },
    { name: "600", token: "--slate-600", value: "#4B5563" },
    { name: "500", token: "--slate-500", value: "#6B7280" },
    { name: "400", token: "--slate-400", value: "#9CA3AF" },
    { name: "300", token: "--slate-300", value: "#D1D5DB", fg: "#111827" },
    { name: "200", token: "--slate-200", value: "#E5E7EB", fg: "#111827" },
    { name: "100", token: "--slate-100", value: "#F3F4F6", fg: "#111827" },
    { name: "50",  token: "--slate-50",  value: "#F9FAFB", fg: "#111827" },
    { name: "white", token: "--white",   value: "#FFFFFF", fg: "#111827" },
  ];
  const status = [
    { name: "Success 700", token: "--success-700", value: "#15803D" },
    { name: "Success 500", token: "--success-500", value: "#16A34A" },
    { name: "Success 100", token: "--success-100", value: "#DCFCE7", fg: "#15803D" },
    { name: "Warning 700", token: "--warning-700", value: "#B45309" },
    { name: "Warning 500", token: "--warning-500", value: "#D97706" },
    { name: "Warning 100", token: "--warning-100", value: "#FEF3C7", fg: "#B45309" },
    { name: "Danger 700",  token: "--danger-700",  value: "#B91C1C" },
    { name: "Danger 500",  token: "--danger-500",  value: "#DC2626" },
    { name: "Danger 100",  token: "--danger-100",  value: "#FEE2E2", fg: "#B91C1C" },
    { name: "Info 700",    token: "--info-700",    value: "#1D4ED8" },
    { name: "Info 500",    token: "--info-500",    value: "#2563EB" },
    { name: "Info 100",    token: "--info-100",    value: "#DBEAFE", fg: "#1D4ED8" },
  ];
  const ratings = [
    { name: "Rating A", token: "--rating-a", value: "#2E7D4F" },
    { name: "Rating B", token: "--rating-b", value: "#6FA84A" },
    { name: "Rating C", token: "--rating-c", value: "#C9A227", fg: "#111827" },
    { name: "Rating D", token: "--rating-d", value: "#D97706" },
    { name: "Rating E", token: "--rating-e", value: "#C0392B" },
  ];

  const semantic = [
    ["--bg-app", "Page background", "#F9FAFB"],
    ["--bg-canvas", "Map / dashboard canvas", "#F5F7FA"],
    ["--bg-surface", "Cards, modals, panels", "#FFFFFF"],
    ["--bg-sunken", "Form rows, inset blocks", "#F9FAFB"],
    ["--bg-muted", "Disabled, placeholders", "#F3F4F6"],
    ["--bg-inverse", "Dark surfaces, tooltips", "#111827"],
    ["--border-subtle", "Internal dividers", "#ECEEF2"],
    ["--border-default", "Cards, inputs, buttons", "#E5E7EB"],
    ["--border-strong", "Hover, emphasized", "#D1D5DB"],
    ["--text-primary", "Body, headings", "#111827"],
    ["--text-secondary", "Supporting copy", "#4B5563"],
    ["--text-muted", "Help, captions, meta", "#6B7280"],
    ["--text-disabled", "Disabled controls", "#9CA3AF"],
    ["--text-link", "Inline links", "#51a2fc"],
    ["--text-on-brand", "On primary buttons", "#FFFFFF"],
  ];

  return (
    <>
      <ColorScale title="Brand · for primary actions, links and focus states only" items={brand} />
      <ColorScale title="Slate · neutral UI palette" items={slate} />
      <ColorScale title="Status · semantic only — never decorative" items={status} />

      <div className="subsection">
        <div className="t-label" style={{ marginBottom: 10 }}>Risk rating scale (preserved from product)</div>
        <div className="grid-6">{ratings.map(it => <ColorSwatch key={it.token} {...it} />)}</div>
        <p className="t-caption" style={{ marginTop: 8 }}>
          Locked to A–E values from <code className="inline">colors.ratings</code>. These are domain-specific (PSC compliance grades) and must remain stable across the product.
        </p>
      </div>

      <div className="subsection">
        <div className="t-label" style={{ marginBottom: 10 }}>Semantic surface, border & text tokens</div>
        <div className="panel">
          {semantic.map(([t, role, val]) => (
            <div key={t} className="token-row">
              <code>{t}</code>
              <span className="swatch-mini" style={{ background: val }} />
              <span style={{ color: "var(--text-secondary)" }}>{role}</span>
              <span className="t-mono" style={{ color: "var(--text-muted)" }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="subsection">
        <div className="t-label" style={{ marginBottom: 10 }}>Usage rules</div>
        <table className="spec-table">
          <thead><tr><th>Rule</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td>Brand color is reserved for primary CTAs, selected nav, links, and focus rings.</td><td>Prevents brand from competing with status colors during incidents.</td></tr>
            <tr><td>Status colors never carry decorative weight (e.g. success-100 is not a "nice green tint").</td><td>So users learn that any colored badge / row tint <em>means</em> something.</td></tr>
            <tr><td>Body text is always <code>--text-primary</code> on light surfaces. Never &lt; 4.5:1 contrast.</td><td>WCAG AA on all dense table content.</td></tr>
            <tr><td>Backgrounds use only the four <code>--bg-*</code> tokens. No raw hex in modules.</td><td>Single source of truth; easier to dark-mode later.</td></tr>
            <tr><td>The legacy <code>react-light-blue / react-dark-blue</code> map to <code>--brand-300 / --brand-600</code>.</td><td>Source compatibility during migration.</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

const TypeSpecimen = ({ cls, label, family, weight, size, lh, role }) => (
  <div className="token-row" style={{ gridTemplateColumns: "200px 1fr 200px" }}>
    <div>
      <div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
      <div className="t-caption">{role}</div>
    </div>
    <div className={cls}>The quick brown fox jumps over the lazy dog</div>
    <div className="t-mono" style={{ color: "var(--text-muted)", fontSize: 11 }}>
      {family} · {weight} · {size}/{lh}
    </div>
  </div>
);

const TypeSection = () => (
  <>
    <div className="subsection">
      <div className="t-label" style={{ marginBottom: 10 }}>Type roles</div>
      <div className="panel">
        <TypeSpecimen cls="t-display" label="Display"   role="Page hero on dashboards. Use sparingly."  family="Exo" weight="600" size="32" lh="40" />
        <TypeSpecimen cls="t-h1"      label="H1"        role="Page header title (one per page)."        family="Exo" weight="600" size="24" lh="32" />
        <TypeSpecimen cls="t-h2"      label="H2"        role="Section / card group title."              family="Exo" weight="600" size="20" lh="28" />
        <TypeSpecimen cls="t-h3"      label="H3"        role="Card title, modal title."                 family="Exo" weight="600" size="16" lh="24" />
        <TypeSpecimen cls="t-h4"      label="H4"        role="Subsection within a card."                family="Exo" weight="600" size="14" lh="20" />
        <TypeSpecimen cls="t-body"    label="Body"      role="Default body text."                       family="Inter" weight="400" size="14" lh="20" />
        <TypeSpecimen cls="t-body-sm" label="Body sm"   role="Tables, dense panels, sidebars."          family="Inter" weight="400" size="13" lh="18" />
        <TypeSpecimen cls="t-caption" label="Caption"   role="Help, meta, captions."                    family="Inter" weight="400" size="12" lh="16" />
        <TypeSpecimen cls="t-label"   label="Label"     role="Field labels, table headers."             family="Inter" weight="600" size="12" lh="16" />
        <TypeSpecimen cls="t-overline" label="Overline" role="Section eyebrows, status group titles."   family="Inter" weight="600" size="11" lh="14" />
        <TypeSpecimen cls="t-mono"    label="Mono"      role="IMO, MMSI, codes, IDs, JSON."             family="JetBrains Mono" weight="400" size="12.5" lh="18" />
      </div>
    </div>

    <div className="subsection">
      <div className="t-label" style={{ marginBottom: 10 }}>Rationale</div>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
        <li>Consolidate Lato + Open Sans → <strong>Inter</strong>: better screen rendering at 12–14px, true tabular-nums, matches B2B SaaS conventions (Linear / Stripe / Vercel).</li>
        <li>Reduce 6 H-styles + 5 body sizes → <strong>5 heading roles + 3 body roles + 2 utility</strong>. Maps cleanly to product usage.</li>
        <li>Always use <code className="inline">tabular-nums</code> on numeric table cells, IMO codes, coordinates, timestamps.</li>
        <li>Never use sizes &lt; 12px in production UI. <code className="inline">10px</code> body (legacy <code className="inline">bodyXXsmall</code>) is removed.</li>
      </ul>
    </div>
  </>
);

const SpacingSection = () => {
  const scale = [
    ["--space-1", 4, "Tight pairings (icon + label inside a chip)"],
    ["--space-2", 8, "Default form gap, button gap, badge padding"],
    ["--space-3", 12, "Card inner padding, list row gap"],
    ["--space-4", 16, "Standard section gap, card body padding"],
    ["--space-5", 20, "Comfortable form vertical spacing"],
    ["--space-6", 24, "Card-to-card gap on dashboards"],
    ["--space-7", 32, "Section vertical spacing on detail pages"],
    ["--space-8", 40, "Page header vertical padding"],
    ["--space-9", 48, "Major page section breaks"],
    ["--space-10", 64, "Page top padding (desktop)"],
    ["--space-11", 96, "Empty / error full-page states"],
  ];
  return (
    <div className="panel">
      {scale.map(([t, v, use]) => (
        <div key={t} className="token-row" style={{ gridTemplateColumns: "180px 80px 140px 1fr" }}>
          <code>{t}</code>
          <span className="t-mono" style={{ color: "var(--text-muted)" }}>{v}px</span>
          <div className="preview">
            <div style={{ background: "var(--brand-300)", height: 12, width: v, borderRadius: 2 }} />
          </div>
          <span style={{ color: "var(--text-secondary)" }}>{use}</span>
        </div>
      ))}
    </div>
  );
};

const RadiusShadowSection = () => {
  const radii = [
    ["--radius-xs", 2, "Inline tags, status dots' inner shapes"],
    ["--radius-sm", 4, "Badges, small chips, table cells"],
    ["--radius-md", 6, "Buttons, inputs, popovers — DEFAULT"],
    ["--radius-lg", 8, "Cards, modals, drawers"],
    ["--radius-xl", 12, "Onboarding & marketing surfaces (rare)"],
    ["--radius-pill", "9999", "Pills, switches, avatars"],
  ];
  const shadows = [
    ["--shadow-xs", "Resting cards, secondary buttons", "0 1px 0 rgba(15, 23, 42, 0.04)"],
    ["--shadow-sm", "Static panels, inline cards", "0 1px 2px rgba(15, 23, 42, 0.06)"],
    ["--shadow-md", "Popovers, dropdowns, tooltips", "0 4px 12px -2px rgba(15, 23, 42, 0.08)"],
    ["--shadow-lg", "Drawers, side panels", "0 12px 24px -8px rgba(15, 23, 42, 0.12)"],
    ["--shadow-xl", "Modals only", "0 24px 48px -12px rgba(15, 23, 42, 0.18)"],
  ];
  return (
    <>
      <div className="subsection">
        <div className="t-label" style={{ marginBottom: 10 }}>Radius scale</div>
        <div className="panel">
          {radii.map(([t, v, use]) => (
            <div key={t} className="token-row" style={{ gridTemplateColumns: "180px 80px 80px 1fr" }}>
              <code>{t}</code>
              <span className="t-mono" style={{ color: "var(--text-muted)" }}>{v}px</span>
              <div style={{ width: 32, height: 32, background: "var(--brand-300)", borderRadius: typeof v === "number" ? v : 9999 }} />
              <span style={{ color: "var(--text-secondary)" }}>{use}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="subsection">
        <div className="t-label" style={{ marginBottom: 10 }}>Elevation</div>
        <div className="panel">
          {shadows.map(([t, use, raw]) => (
            <div key={t} className="token-row" style={{ gridTemplateColumns: "180px 1fr 80px" }}>
              <div>
                <code>{t}</code>
                <div className="t-caption" style={{ marginTop: 2 }}>{use}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: 80, height: 60, background: "white", border: "1px solid var(--border-default)", borderRadius: 6, boxShadow: `var(${t})` }} />
              </div>
              <span className="t-mono" style={{ color: "var(--text-muted)", fontSize: 10 }}>{raw}</span>
            </div>
          ))}
        </div>
        <div className="callout" style={{ marginTop: 16 }}>
          <strong>Rule:</strong> Borders define structure; shadows define elevation. A surface should rarely use both heavily — choose one. Dashboards default to <em>border + shadow-xs</em>, never <em>shadow-md</em>.
        </div>
      </div>
    </>
  );
};

window.ColorSection = ColorSection;
window.TypeSection = TypeSection;
window.SpacingSection = SpacingSection;
window.RadiusShadowSection = RadiusShadowSection;
