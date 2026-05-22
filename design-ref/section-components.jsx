/* Section 3 — Components: buttons, forms, badges, alerts, cards, tables, tabs, etc. */

const ComponentBlock = ({ id, name, purpose, variants, states, rules, children }) => (
  <div id={id} className="subsection" style={{ marginTop: 48 }}>
    <h3 className="subsection-title">
      <span>{name}</span>
      <span className="ord">component</span>
    </h3>
    <p className="subsection-desc">{purpose}</p>
    <div className="panel">
      <div className="panel-head">
        <h4>Preview</h4>
        <span className="meta">all states · all variants</span>
      </div>
      <div className="panel-body" style={{ background: "var(--bg-app)" }}>{children}</div>
      {(variants || states || rules) && (
        <table className="spec-table" style={{ border: 0, borderRadius: 0, borderTop: "1px solid var(--border-subtle)" }}>
          <tbody>
            {variants && <tr><td style={{ width: 120, color: "var(--text-muted)", textTransform: "uppercase", fontSize: 11, letterSpacing: "0.04em" }}>Variants</td><td>{variants}</td></tr>}
            {states && <tr><td style={{ width: 120, color: "var(--text-muted)", textTransform: "uppercase", fontSize: 11, letterSpacing: "0.04em" }}>States</td><td>{states}</td></tr>}
            {rules && <tr><td style={{ width: 120, color: "var(--text-muted)", textTransform: "uppercase", fontSize: 11, letterSpacing: "0.04em" }}>Rules</td><td>{rules}</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  </div>
);

const ButtonsBlock = () => (
  <ComponentBlock
    id="c-buttons"
    name="Buttons"
    purpose="Trigger actions. One primary per surface; secondary actions are quieter; destructive actions use the danger variant only when the action cannot be undone safely."
    variants={<><code className="inline">primary</code> · <code className="inline">secondary</code> · <code className="inline">ghost</code> · <code className="inline">danger</code> · <code className="inline">link</code></>}
    states={<>default · hover · active · disabled · loading · focus-visible</>}
    rules={<>Heights snap to <code className="inline">24 / 28 / 32 / 40px</code>. Icon-only buttons are square. Never stack &gt; 3 buttons in a row — collapse into a menu.</>}
  >
    <div className="col" style={{ gap: 24 }}>
      <div className="row">
        <button className="ds-btn ds-btn--primary"><Icon d={I.plus} /> New portfolio</button>
        <button className="ds-btn ds-btn--secondary">Cancel</button>
        <button className="ds-btn ds-btn--ghost">More</button>
        <button className="ds-btn ds-btn--danger"><Icon d={I.trash} /> Delete</button>
        <button className="ds-btn ds-btn--link">View report →</button>
      </div>
      <div className="row">
        <button className="ds-btn ds-btn--primary ds-btn--xs">xs</button>
        <button className="ds-btn ds-btn--primary ds-btn--sm">sm</button>
        <button className="ds-btn ds-btn--primary ds-btn--md">md (default)</button>
        <button className="ds-btn ds-btn--primary ds-btn--lg">lg</button>
        <button className="ds-btn ds-btn--secondary ds-btn--icon"><Icon d={I.edit} /></button>
        <button className="ds-btn ds-btn--secondary ds-btn--icon ds-btn--sm"><Icon d={I.more} /></button>
      </div>
      <div className="row">
        <button className="ds-btn ds-btn--primary" disabled>Disabled</button>
        <button className="ds-btn ds-btn--secondary" disabled>Disabled</button>
        <button className="ds-btn ds-btn--primary"><span className="ds-skel" style={{ width: 14, height: 14, borderRadius: "50%" }} /> Saving…</button>
      </div>
      <div className="callout" style={{ fontSize: 12 }}>
        <strong>Hierarchy rule:</strong> Primary on the right of a row, Secondary to its left, destructive at the far left or in an overflow menu.
        Cancel is always Secondary, never a separate variant.
      </div>
    </div>
  </ComponentBlock>
);

const FormsBlock = () => (
  <ComponentBlock
    id="c-forms"
    name="Inputs, Selects, Textareas"
    purpose="All text input controls share one shell so they can be combined inside FormField groups."
    variants={<>text · select · textarea · search · number · password</>}
    states={<>default · hover · focus · disabled · readonly · invalid · with prefix / suffix</>}
    rules={<>Height <code className="inline">32px</code> default; <code className="inline">40px</code> for primary forms. Always paired with a Label and optional Help text. Errors appear below the field, never as a tooltip.</>}
  >
    <div className="grid-2" style={{ gap: 24 }}>
      <div className="ds-field">
        <label className="ds-field-label">IMO number <span className="ds-field-required">*</span></label>
        <input className="ds-input" placeholder="e.g. 9123456" defaultValue="9123456" />
        <div className="ds-field-help">7-digit International Maritime Organization number.</div>
      </div>
      <div className="ds-field">
        <label className="ds-field-label">Vessel type</label>
        <select className="ds-input ds-select" defaultValue="bulk">
          <option value="bulk">Bulk carrier</option>
          <option value="tanker">Tanker</option>
          <option value="container">Container</option>
        </select>
      </div>
      <div className="ds-field">
        <label className="ds-field-label">Search</label>
        <div style={{ position: "relative" }}>
          <Icon d={I.search} size={14} stroke="var(--text-muted)" className="ico-14" />
          <input className="ds-input" placeholder="Search vessels, regions, policies…" style={{ paddingLeft: 32 }} />
          <span style={{ position: "absolute", left: 10, top: 9, color: "var(--text-muted)", pointerEvents: "none" }}>
            <Icon d={I.search} size={14} stroke="currentColor" />
          </span>
        </div>
      </div>
      <div className="ds-field">
        <label className="ds-field-label">Effective date</label>
        <input className="ds-input" type="text" defaultValue="2026-04-29" />
      </div>
      <div className="ds-field">
        <label className="ds-field-label">Notes</label>
        <textarea className="ds-input" style={{ height: 72, padding: 8, resize: "vertical" }} placeholder="Optional context for the underwriter…" />
      </div>
      <div className="ds-field">
        <label className="ds-field-label">Premium (USD)</label>
        <input className="ds-input" defaultValue="−250" aria-invalid="true" />
        <div className="ds-field-error"><Icon d={I.alert} size={12} /> Must be a positive number.</div>
      </div>
      <div className="ds-field">
        <label className="ds-field-label">Disabled</label>
        <input className="ds-input" defaultValue="Read only" disabled />
      </div>
      <div className="ds-field">
        <label className="ds-field-label">Toggles & checks</label>
        <div className="row" style={{ gap: 16 }}>
          <label className="row" style={{ gap: 6, fontSize: 13 }}><input type="checkbox" className="ds-check" defaultChecked /> Active</label>
          <label className="row" style={{ gap: 6, fontSize: 13 }}><input type="checkbox" className="ds-check" /> Archived</label>
          <label className="row" style={{ gap: 6, fontSize: 13 }}><input type="radio" name="r" className="ds-radio" defaultChecked /> Daily</label>
          <label className="row" style={{ gap: 6, fontSize: 13 }}><input type="radio" name="r" className="ds-radio" /> Weekly</label>
          <button role="switch" aria-checked="true" className="ds-switch" />
          <button role="switch" aria-checked="false" className="ds-switch" />
        </div>
      </div>
    </div>
  </ComponentBlock>
);

const BadgesBlock = () => (
  <ComponentBlock
    id="c-badges"
    name="Badges & Status"
    purpose="Inline labels for status, count and category. Risk ratings (A–E) are a distinct, locked-down primitive."
    variants={<>neutral · info · success · warning · danger · with dot · risk-rating</>}
    rules={<>Tone is semantic, not decorative. Use neutral for counts; reserve color tones for genuine status.</>}
  >
    <div className="col" style={{ gap: 16 }}>
      <div className="row">
        <span className="ds-badge ds-badge--neutral">Draft</span>
        <span className="ds-badge ds-badge--info ds-badge--dot">In review</span>
        <span className="ds-badge ds-badge--success ds-badge--dot">Compliant</span>
        <span className="ds-badge ds-badge--warning ds-badge--dot">At risk</span>
        <span className="ds-badge ds-badge--danger ds-badge--dot">Sanctioned</span>
        <span className="ds-badge ds-badge--neutral">42 vessels</span>
      </div>
      <div className="row">
        <span className="ds-rating ds-rating--a">A</span>
        <span className="ds-rating ds-rating--b">B</span>
        <span className="ds-rating ds-rating--c">C</span>
        <span className="ds-rating ds-rating--d">D</span>
        <span className="ds-rating ds-rating--e">E</span>
        <span className="t-caption">PSC compliance grades — tied to <code className="inline">--rating-*</code></span>
      </div>
    </div>
  </ComponentBlock>
);

const AlertsBlock = () => (
  <ComponentBlock
    id="c-alerts"
    name="Alerts & Banners"
    purpose="Persistent feedback for the current surface. Toasts (transient) are a separate component."
    variants={<>info · success · warning · danger</>}
    rules={<>Always lead with a short <em>title</em>, then a sentence of context. Include a primary action when one exists; never two CTAs.</>}
  >
    <div className="col" style={{ gap: 12 }}>
      <div className="ds-alert ds-alert--info">
        <Icon d={I.info} className="ds-alert-icon" stroke="var(--info-700)" />
        <div className="ds-alert-body"><div className="ds-alert-title">Region data refreshed</div>13 new vessels matched your North Atlantic filter set.</div>
      </div>
      <div className="ds-alert ds-alert--success">
        <Icon d={I.check} className="ds-alert-icon" stroke="var(--success-700)" />
        <div className="ds-alert-body"><div className="ds-alert-title">Policy saved</div>Policy #44721 was added to <em>Atlantic Hull Programme 2026</em>.</div>
      </div>
      <div className="ds-alert ds-alert--warning">
        <Icon d={I.warn} className="ds-alert-icon" stroke="var(--warning-700)" />
        <div className="ds-alert-body"><div className="ds-alert-title">Severe weather along voyage</div>Force 9 conditions forecast crossing the planned route within 24h.</div>
      </div>
      <div className="ds-alert ds-alert--danger">
        <Icon d={I.alert} className="ds-alert-icon" stroke="var(--danger-700)" />
        <div className="ds-alert-body"><div className="ds-alert-title">Sanctioned vessel detected</div>1 vessel in this portfolio matches the OFAC SDN list. Action required.</div>
      </div>
    </div>
  </ComponentBlock>
);

const CardsBlock = () => (
  <ComponentBlock
    id="c-cards"
    name="Cards"
    purpose="Group related content on dashboards and detail pages. Cards never nest more than one level deep."
    variants={<>plain · stat · list · with footer actions</>}
    rules={<>Single border + <code className="inline">shadow-xs</code>. Card title is H3 / 16px. Internal padding 16px (or 24px on dashboards).</>}
  >
    <div className="grid-3">
      <div className="ds-card">
        <div className="ds-card-head"><h3 className="ds-card-title">Vessels at risk</h3><span className="t-caption">Today</span></div>
        <div className="ds-card-body">
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="t-display">23</span>
            <span className="ds-badge ds-badge--danger ds-badge--dot">+4</span>
          </div>
          <p className="t-caption" style={{ marginTop: 8 }}>across 6 portfolios</p>
        </div>
      </div>
      <div className="ds-card">
        <div className="ds-card-head"><h3 className="ds-card-title">Compliance score</h3></div>
        <div className="ds-card-body">
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="t-display">94<span style={{ fontSize: 20, color: "var(--text-muted)" }}>%</span></span>
            <span className="ds-badge ds-badge--success ds-badge--dot">+1.2</span>
          </div>
          <div className="ds-progress" style={{ marginTop: 12 }}><span style={{ width: "94%" }} /></div>
        </div>
      </div>
      <div className="ds-card">
        <div className="ds-card-head"><h3 className="ds-card-title">Recent activity</h3><a className="ds-btn ds-btn--link">View all</a></div>
        <div className="ds-card-body" style={{ padding: 0 }}>
          {["Policy #44721 added", "Region NA-04 updated", "M/V Stratos flagged"].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderTop: i ? "1px solid var(--border-subtle)" : 0, fontSize: 13 }}>
              <span className="ds-avatar" style={{ width: 22, height: 22, fontSize: 10 }}>JL</span>
              <span style={{ flex: 1 }}>{t}</span>
              <span className="t-caption">2m</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </ComponentBlock>
);

const TablesBlock = () => (
  <ComponentBlock
    id="c-tables"
    name="Tables"
    purpose="The most-used surface in this product. Density is critical: an underwriter scans 200+ rows per session."
    variants={<>default · compact · comfy · with selection · sortable header</>}
    rules={<>One implementation only — replaces the four current variants. Sticky header, alternating-row backgrounds removed in favor of subtle hover highlight. Numeric columns right-aligned with <code className="inline">tabular-nums</code>.</>}
  >
    <div className="ds-card" style={{ overflow: "hidden", padding: 0 }}>
      <div style={{ padding: 12, borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 8 }}>
        <h3 className="ds-card-title" style={{ flex: 1 }}>Portfolio · Atlantic Hull Programme 2026</h3>
        <button className="ds-btn ds-btn--ghost ds-btn--sm"><Icon d={I.filter} /> Filter</button>
        <button className="ds-btn ds-btn--secondary ds-btn--sm"><Icon d={I.download} /> Export</button>
      </div>
      <table className="ds-table">
        <thead>
          <tr>
            <th style={{ width: 28 }}><input type="checkbox" className="ds-check" /></th>
            <th>Vessel</th>
            <th style={{ width: 120 }}>IMO</th>
            <th style={{ width: 90 }}>Flag</th>
            <th style={{ width: 90 }}>Risk</th>
            <th style={{ width: 140 }}>Status</th>
            <th className="num" style={{ width: 120 }}>Sum insured</th>
            <th style={{ width: 60 }}></th>
          </tr>
        </thead>
        <tbody>
          {[
            ["M/V Stratos", "9472183", "MT", "A", "Compliant", 28_400_000],
            ["Aegean Pioneer", "9301847", "GR", "B", "In review", 14_900_000],
            ["Bristol Endeavour", "9618742", "GB", "C", "At risk", 19_500_000],
            ["Norwegian Beacon", "9510938", "NO", "A", "Compliant", 31_200_000],
            ["Helios Carrier", "9432751", "PA", "E", "Sanctioned", 12_700_000],
          ].map((r, i) => (
            <tr key={i}>
              <td><input type="checkbox" className="ds-check" /></td>
              <td><strong>{r[0]}</strong></td>
              <td className="t-mono" style={{ fontSize: 12 }}>{r[1]}</td>
              <td>{r[2]}</td>
              <td><span className={`ds-rating ds-rating--${r[3].toLowerCase()}`}>{r[3]}</span></td>
              <td><span className={`ds-badge ds-badge--${r[4]==="Compliant"?"success":r[4]==="In review"?"info":r[4]==="At risk"?"warning":"danger"} ds-badge--dot`}>{r[4]}</span></td>
              <td className="num">${r[5].toLocaleString()}</td>
              <td><button className="ds-btn ds-btn--ghost ds-btn--icon ds-btn--sm"><Icon d={I.more} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </ComponentBlock>
);

const NavTabsBlock = () => {
  const [activeTab, setActiveTab] = React.useState("Overview");
  const tabs = ["Overview", "Voyages", "Casualties", "Compliance", "Documents"];
  const motion = window.Motion || window.framerMotion || window.FramerMotion;
  const M = motion ? motion.motion : null;
  return (
  <ComponentBlock
    id="c-tabs"
    name="Tabs, Breadcrumbs & Page header"
    purpose="Top-of-page navigation primitives. Tabs switch views within a single resource; breadcrumbs show hierarchy."
  >
    <div className="ds-card">
      <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
        <a className="ds-btn ds-btn--link" style={{ fontSize: 12 }}>Portfolios</a>
        <Icon d={I.chevronRight} size={12} />
        <a className="ds-btn ds-btn--link" style={{ fontSize: 12 }}>Atlantic Hull 2026</a>
        <Icon d={I.chevronRight} size={12} />
        <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>M/V Stratos</span>
      </div>
      <div style={{ padding: "8px 20px 16px", display: "flex", alignItems: "center", gap: 16 }}>
        <h2 className="t-h1" style={{ flex: 1, margin: 0 }}>M/V Stratos</h2>
        <button className="ds-btn ds-btn--secondary"><Icon d={I.download} /> Export PDF</button>
        <button className="ds-btn ds-btn--primary"><Icon d={I.flag} /> Flag for review</button>
      </div>
      <div className="ds-tabs" style={{ margin: "0 20px 16px" }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              className="ds-tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab)}
            >
              {isActive && M && (
                <M.span
                  key="pill"
                  layoutId="ds-tab-pill"
                  className="ds-tab-pill"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span key="label" className="ds-tab-label">{tab}</span>
            </button>
          );
        })}
      </div>
    </div>
  </ComponentBlock>
  );
};

const OverlayBlock = () => (
  <ComponentBlock
    id="c-overlays"
    name="Modals, Drawers, Popovers, Tooltips"
    purpose="Surfaces that overlay the page. Modals block; drawers and popovers don't."
    rules={<>Modal width <code className="inline">480 / 640 / 800px</code>. Drawer width <code className="inline">400 / 560 / 720px</code> from right. Tooltip max-width <code className="inline">240px</code>.</>}
  >
    <div className="grid-2">
      <div className="surface" style={{ padding: 0 }}>
        <div className="surface-toolbar"><span className="dot r" /><span className="dot y" /><span className="dot g" /><span style={{ marginLeft: 8 }}>modal · 480px</span></div>
        <div style={{ background: "rgba(15,23,42,0.4)", padding: "20px 24px", display: "grid", placeItems: "center", minHeight: 240 }}>
          <div style={{ background: "white", width: 380, borderRadius: 8, boxShadow: "var(--shadow-xl)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center" }}>
              <h3 className="ds-card-title" style={{ flex: 1 }}>Delete portfolio?</h3>
              <button className="ds-btn ds-btn--ghost ds-btn--icon ds-btn--sm"><Icon d={I.x} /></button>
            </div>
            <div style={{ padding: "16px 20px", fontSize: 13, color: "var(--text-secondary)" }}>This will permanently remove <strong style={{ color: "var(--text-primary)" }}>Atlantic Hull 2026</strong>, its 142 policies, and all associated voyage data. This cannot be undone.</div>
            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border-subtle)", background: "var(--slate-50)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="ds-btn ds-btn--secondary">Cancel</button>
              <button className="ds-btn ds-btn--danger">Delete portfolio</button>
            </div>
          </div>
        </div>
      </div>
      <div className="surface" style={{ padding: 0 }}>
        <div className="surface-toolbar"><span className="dot r" /><span className="dot y" /><span className="dot g" /><span style={{ marginLeft: 8 }}>popover · tooltip · empty state</span></div>
        <div style={{ padding: 24, display: "grid", gap: 16 }}>
          <div style={{ position: "relative", display: "inline-block", width: "fit-content" }}>
            <button className="ds-btn ds-btn--secondary"><Icon d={I.filter} /> Filters</button>
            <div style={{ position: "absolute", top: 38, left: 0, width: 280, background: "white", border: "1px solid var(--border-default)", borderRadius: 6, boxShadow: "var(--shadow-md)", padding: 12, zIndex: 2 }}>
              <div className="t-label" style={{ marginBottom: 8 }}>Filter vessels</div>
              <div className="ds-field" style={{ gap: 4 }}>
                <label className="ds-field-label" style={{ fontSize: 11 }}>Risk grade</label>
                <select className="ds-input ds-select" style={{ height: 28, fontSize: 12 }}><option>All</option></select>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
                <button className="ds-btn ds-btn--ghost ds-btn--sm">Reset</button>
                <button className="ds-btn ds-btn--primary ds-btn--sm">Apply</button>
              </div>
            </div>
          </div>
          <div style={{ position: "relative", display: "inline-block", marginTop: 80 }}>
            <button className="ds-btn ds-btn--ghost"><Icon d={I.info} /> hover me</button>
            <div className="ds-tooltip" style={{ top: -32, left: "50%", transform: "translateX(-50%)" }}>Risk score updated 4m ago</div>
          </div>
          <div className="ds-empty">
            <div className="ds-empty-icon"><Icon d={I.folder} size={20} /></div>
            <h4>No vessels match these filters</h4>
            <p>Try widening the risk range or removing the flag filter.</p>
            <button className="ds-btn ds-btn--secondary ds-btn--sm">Reset filters</button>
          </div>
        </div>
      </div>
    </div>
  </ComponentBlock>
);

const LoadingBlock = () => (
  <ComponentBlock
    id="c-loading"
    name="Loading & Skeleton states"
    purpose="Never block the user with a full-page spinner. Skeleton frames mirror final layout so perceived load time is short."
    rules={<>Tables and cards have skeleton variants. Use a thin top progress bar for navigation. Spinners only appear inside buttons / row actions.</>}
  >
    <div className="grid-2">
      <div className="ds-card">
        <div className="ds-card-head"><span className="ds-skel" style={{ width: 120 }} /></div>
        <div className="ds-card-body" style={{ display: "grid", gap: 8 }}>
          <span className="ds-skel" style={{ width: "70%" }} />
          <span className="ds-skel" style={{ width: "90%" }} />
          <span className="ds-skel" style={{ width: "50%" }} />
        </div>
      </div>
      <div className="ds-card">
        <table className="ds-table">
          <thead><tr><th>Vessel</th><th>IMO</th><th>Risk</th></tr></thead>
          <tbody>{[0,1,2,3].map(i => (
            <tr key={i}><td><span className="ds-skel" style={{ width: 140 }}/></td><td><span className="ds-skel" style={{ width: 80 }}/></td><td><span className="ds-skel" style={{ width: 24, height: 16 }}/></td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  </ComponentBlock>
);

const ComponentsSection = () => (
  <>
    <ButtonsBlock />
    <FormsBlock />
    <BadgesBlock />
    <AlertsBlock />
    <CardsBlock />
    <TablesBlock />
    <NavTabsBlock />
    <OverlayBlock />
    <LoadingBlock />
  </>
);

window.ComponentsSection = ComponentsSection;
