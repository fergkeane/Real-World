/* Cache version: clears stale localStorage on first load of new version */
try {
  if (localStorage.getItem('rw_cv') !== '2') {
    localStorage.setItem('rw_theme', 'sky');
    localStorage.setItem('rw_cv', '2');
  }
} catch {}

/* ------------------ SHARED CHROME (sidebar, topbar, tweaks, icons) ------------------ */
/* Expects: window.PAGE = { id, title, crumb } set before this script loads */

/* ------------------ ICONS (Lucide) ------------------ */
const LUCIDE_NAMES = {
  menu:'Menu', grid:'LayoutGrid', shield:'ShieldCheck',
  building:'Building', building2Nav:'Warehouse', news:'Newspaper',
  plane:'Plane', bolt:'Zap', briefcase:'Briefcase', doc:'FileText',
  globe:'Globe', wave:'Waves', chart:'BarChart3', book:'BookOpen',
  anchor:'Anchor', cloud:'Cloud', ship:'Ship', building2:'Building2',
  plane2:'Plane', bolt2:'Zap', bell:'Bell', help:'HelpCircle',
  anchor2:'Anchor', pin:'MapPin', cloudrain:'CloudRain', cloudicon:'Cloud',
  docs2:'FileText', search2:'Search', factory:'Factory', search:'Search',
  chev:'ChevronRight', chevDown:'ChevronDown', plus:'Plus', minus:'Minus', x:'X',
  arrowUp:'ArrowUp', arrowDown:'ArrowDown', filter:'Filter', layers:'Layers',
  compass:'Compass', maximize:'Maximize2', minimize:'Minimize2', alertTri:'AlertTriangle',
  radio:'RadioTower', check:'Check', cargo:'Container', tag:'Tag',
  clipboard:'Clipboard', users:'Users', leaf:'Leaf', fileText:'FileText', clock:'Clock',
  office:'Building2',
};
const LUCIDE_SIZES = {
  ship:'h-10 w-10', building2:'h-10 w-10', plane2:'h-10 w-10', bolt2:'h-10 w-10',
  anchor2:'h-8 w-8', pin:'h-8 w-8', cloudrain:'h-8 w-8', cloudicon:'h-8 w-8',
  docs2:'h-8 w-8', search2:'h-8 w-8', factory:'h-8 w-8',
  search:'h-4 w-4', chev:'h-4 w-4', chevDown:'h-4 w-4', plus:'h-4 w-4', minus:'h-4 w-4', x:'h-4 w-4',
  arrowUp:'h-3 w-3', arrowDown:'h-3 w-3',
};
function lucideIcon(alias) {
  const name = LUCIDE_NAMES[alias];
  const size = LUCIDE_SIZES[alias] || 'h-5 w-5';
  const data = (window.lucide && lucide.icons && lucide.icons[name]);
  if (!data) return `<span class="${size} inline-block"></span>`;
  const [tag, attrs, children] = data;
  const attrStr = Object.entries(attrs).map(([k,v]) => `${k}="${v}"`).join(' ');
  const inner = (children || []).map(([ctag, cattrs]) =>
    `<${ctag} ${Object.entries(cattrs).map(([k,v]) => `${k}="${v}"`).join(' ')}/>`
  ).join('');
  return `<${tag} ${attrStr} class="${size}">${inner}</${tag}>`;
}
const I = new Proxy({}, { get: (_t, prop) => lucideIcon(prop) });

/* ------------------ NAV ------------------ */
const NAV = [
  { id:'dash',       label:'Dashboard',       icon:'grid',         href:'Dashboard.html' },
  { id:'marine',     label:'Marine',          icon:'ship',         href:'MarineDashboard.html' },
  { id:'property',   label:'Property',        icon:'building',     href:'PropertyDashboard.html' },
  { id:'aviation',   label:'Aviation',        icon:'plane',        href:'AviationDashboard.html' },
  { id:'energy',     label:'Offshore/Energy', icon:'bolt',         href:'OffshoreDashboard.html' },
  { id:'cargo',      label:'Cargo',           icon:'cargo',        href:'CargoDashboard.html' },
  { id:'portfolios', label:'Portfolios',      icon:'briefcase',    href:'AllPortfolios.html' },
  { id:'reports',    label:'Reports',         icon:'doc',          href:'Reports.html' },
  { id:'companies',  label:'Companies',       icon:'office',       href:'Companies.html' },
  { id:'regions',    label:'Regions',         icon:'globe',        href:'Regions.html' },
  { id:'events',     label:'Nat Cat Events',  icon:'wave',         href:'NatCatEvents.html', badge:true },
  { id:'assets',     label:'Assets',          icon:'building2Nav', href:'AssetsSearch.html' },
  { id:'ports',      label:'Ports',           icon:'anchor',       href:'Ports.html' },
  { id:'weather',    label:'Weather',         icon:'cloud',        href:'Weather.html' },
];

const PROFILE_LINKS = [
  { label:'Organisations', href:'Organisations.html' },
  { label:'Rule Sets',     href:'RuleSets.html' },
  { label:'Extras',        href:'Extras.html' },
  { label:'News',          href:'News.html' },
];

const NOTIFS = [
  { t:'Hurricane Advisory', sub:'Cat 3 system approaching Gulf — 38 assets in cone', time:'12m', tone:'rose' },
  { t:'Policy Renewal',     sub:'MV Orion hull & machinery renews in 6 days',         time:'1h', tone:'amber' },
  { t:'New Report Ready',   sub:'Q1 Aviation Exposure — 48 pages',                    time:'3h', tone:'brand' },
  { t:'Port Closure',       sub:'Rotterdam — Terminal C closed through 04/24',        time:'1d', tone:'ink' },
];

function toneClasses(tone) {
  const m = {
    indigo:  { bg:'bg-indigo-50',  text:'text-indigo-600',  ring:'ring-indigo-100' },
    emerald: { bg:'bg-emerald-50', text:'text-emerald-600', ring:'ring-emerald-100' },
    amber:   { bg:'bg-amber-50',   text:'text-amber-600',   ring:'ring-amber-100' },
    rose:    { bg:'bg-rose-50',    text:'text-rose-600',    ring:'ring-rose-100' },
    brand:   { bg:'bg-brand-50',   text:'text-brand-600',   ring:'ring-brand-100' },
    ink:     { bg:'bg-ink-100',    text:'text-ink-700',     ring:'ring-ink-200' },
  };
  return m[tone] || m.brand;
}

function Sidebar() {
  const activeId = (window.PAGE && window.PAGE.id) || 'dash';
  return `
  <style>
    #sidebar[data-expanded="true"] .sidebar-logo { opacity:1 !important; pointer-events:auto !important; }
    #sidebar:not([data-expanded="true"]) .sidebar-logo { opacity:0 !important; pointer-events:none !important; width:0 !important; overflow:hidden !important; }
  </style>
  <div id="sidebar-backdrop" class="hidden md:!hidden fixed inset-0 bg-black/40 z-[1999]"></div>
  <aside id="sidebar" class="shrink-0 bg-white border-r border-ink-200 h-screen sticky top-0 flex flex-col transition-[width,transform] duration-200 max-md:fixed max-md:left-0 max-md:top-0 max-md:-translate-x-full" style="width:56px; z-index:2000">
    <div class="h-14 flex items-center border-b border-ink-200 px-2 gap-2">
      <img src="images/skytek-realworld-landscape-color.png" alt="Real World" class="sidebar-logo" style="height:28px;object-fit:contain;opacity:0;pointer-events:none;transition:opacity 150ms;flex:1;min-width:0;" />
      <button id="collapse-btn" class="shrink-0 p-2 rounded-lg hover:bg-ink-100 text-ink-700 ring-focus" title="Toggle menu">${I.menu}</button>
    </div>
    <nav class="flex-1 py-3 flex flex-col items-stretch gap-0.5 px-2 overflow-y-auto scroll-thin">
      ${NAV.map(item => {
        const active = item.id === activeId;
        const tag = item.href ? 'a' : 'button';
        const hrefAttr = item.href ? `href="${item.href}"` : '';
        return `
        <${tag} ${hrefAttr} data-nav="${item.id}" class="nav-item group relative flex items-center gap-3 h-10 rounded-lg px-2 text-ink-500 hover:text-ink-800 hover:bg-ink-100 ring-focus no-underline ${active ? 'is-nav-active' : ''}">
          <span class="shrink-0 flex items-center justify-center w-7 h-7 nav-ico">${I[item.icon]}</span>
          <span class="nav-label truncate hidden text-sm font-medium">${item.label}</span>
          ${item.badge?`<span class="absolute top-1.5 left-7 h-1.5 w-1.5 rounded-full bg-rose-500 dot-pulse"></span>`:''}
          <span class="nav-tip pointer-events-none fixed whitespace-nowrap rounded-lg text-white text-[13px] font-semibold px-3.5 py-2 transition-opacity" style="background:#0f172a; box-shadow:0 4px 12px rgba(15,23,42,.25); z-index:99999; opacity:0; pointer-events:none;">
            ${item.label}
            <span aria-hidden="true" class="absolute top-1/2 -translate-y-1/2" style="left:-5px; width:0; height:0; border-top:6px solid transparent; border-bottom:6px solid transparent; border-right:6px solid #0f172a;"></span>
          </span>
        </${tag}>`;
      }).join('')}
    </nav>
    <div class="border-t border-ink-200 p-2">
      <button class="w-full flex items-center gap-2 h-9 rounded-lg px-2 text-ink-500 hover:text-ink-800 hover:bg-ink-100 ring-focus">
        <span class="shrink-0 flex items-center justify-center w-7 h-7">${I.help}</span>
        <span class="nav-label truncate hidden text-sm font-medium">Help</span>
      </button>
    </div>
  </aside>`;
}

function Topbar() {
  const id    = (window.PAGE && window.PAGE.id) || 'dash';
  const title = (window.PAGE && window.PAGE.title) || 'Dashboard';
  const crumb = (window.PAGE && window.PAGE.crumb) || 'Overview';
  const navItem = NAV.find(n => n.id === id);
  const titleEl = navItem
    ? `<a href="${navItem.href}" class="topbar-brand-link text-xs font-bold tracking-micro uppercase no-underline">${title}</a>`
    : `<span class="text-xs font-bold tracking-micro text-ink-900 uppercase">${title}</span>`;
  return `
  <header class="h-14 shrink-0 bg-white border-b border-ink-200 flex items-center px-4 gap-3 sticky top-0 z-30">
    <button id="mobile-menu-btn" class="md:hidden h-9 w-9 rounded-lg text-ink-700 hover:bg-ink-100 flex items-center justify-center ring-focus" title="Menu">${I.menu}</button>
    <div class="flex items-center gap-3 min-w-0">
      ${titleEl}
      <div class="hidden md:flex items-center gap-1 text-xs text-ink-400">
        <span>/</span><span>${crumb}</span>
      </div>
    </div>
    <div class="flex-1"></div>
    <div class="flex items-center gap-1">
      <button class="hidden md:flex relative h-9 w-9 rounded-lg text-ink-500 hover:text-ink-800 hover:bg-ink-100 items-center justify-center ring-focus" title="Help">${I.help}</button>
      <button id="notif-btn" class="relative h-9 w-9 rounded-lg text-ink-500 hover:text-ink-800 hover:bg-ink-100 flex items-center justify-center ring-focus" title="Notifications">
        ${I.bell}<span class="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-rose-500 dot-pulse"></span>
      </button>
      <div class="w-px h-6 bg-ink-200 mx-2"></div>
      <button id="user-btn" class="flex items-center gap-2.5 h-9 pr-1.5 pl-2 rounded-lg hover:bg-ink-100 ring-focus">
        <div class="hidden md:block text-right leading-tight">
          <div class="text-xs font-semibold text-ink-900">Paul Kiernan</div>
          <div class="text-[11px] text-ink-500">Risk Manager</div>
        </div>
        <div class="h-8 w-8 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
          <img src="images/avatar-paul-kiernan.avif" alt="Paul Kiernan" style="width:100%;height:100%;object-fit:cover" />
        </div>
      </button>
    </div>
    <div id="notif-pop" class="hidden absolute top-12 right-24 w-[360px] bg-white border border-ink-200 rounded-xl shadow-card-hover overflow-hidden z-40 pop-enter">
      <div class="flex items-center justify-between px-4 py-3 border-b border-ink-100">
        <div class="text-sm font-semibold text-ink-900">Notifications</div>
        <button class="text-xs text-brand-600 hover:underline">Mark all read</button>
      </div>
      <div class="max-h-[360px] overflow-y-auto scroll-thin divide-y divide-ink-100">
        ${NOTIFS.map(n => {
          const t = toneClasses(n.tone);
          return `<div class="flex items-start gap-3 p-3 hover:bg-ink-50 cursor-pointer">
            <div class="mt-0.5 h-8 w-8 rounded-lg ${t.bg} ${t.text} flex items-center justify-center shrink-0">${I.bell}</div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-medium text-ink-900 truncate">${n.t}</div>
              <div class="text-xs text-ink-500 mt-0.5 line-clamp-2">${n.sub}</div>
            </div>
            <div class="text-[11px] text-ink-400 shrink-0">${n.time}</div>
          </div>`;
        }).join('')}
      </div>
      <div class="px-4 py-2.5 border-t border-ink-100 bg-ink-50/60 text-center">
        <button class="text-xs font-medium text-brand-600 hover:underline">View all activity</button>
      </div>
    </div>
    <div id="user-pop" class="hidden absolute top-12 right-4 w-56 bg-white border border-ink-200 rounded-xl shadow-card-hover overflow-hidden z-40 pop-enter">
      <div class="p-3 border-b border-ink-100">
        <div class="text-sm font-semibold text-ink-900">Paul Kiernan</div>
        <div class="text-xs text-ink-500">paul.k@realworld.co</div>
      </div>
      <div class="py-1 text-sm">
        <a href="Profile.html" class="block w-full text-left px-3 py-1.5 hover:bg-ink-100 text-ink-700 no-underline">My profile</a>
        <button class="w-full text-left px-3 py-1.5 hover:bg-ink-100 text-ink-700">Support</button>
        <a href="Administration.html" class="block w-full text-left px-3 py-1.5 hover:bg-ink-100 text-ink-700 no-underline">Administration</a>
      </div>
      <div class="py-1 border-t border-ink-100 text-sm">
        ${PROFILE_LINKS.map(l => `<a href="${l.href}" class="block w-full text-left px-3 py-1.5 hover:bg-ink-100 text-ink-700 no-underline">${l.label}</a>`).join('')}
      </div>
      <div class="py-1 border-t border-ink-100">
        <a href="index.html" class="block w-full text-left px-3 py-1.5 hover:bg-ink-100 text-rose-600 text-sm no-underline">Sign out</a>
      </div>
    </div>
  </header>`;
}

/* Tweaks */
const TWEAK_DEFAULTS_SHARED = { density:'compact', accent:'blue', sidebarExpanded:true, showSparklines:true };
let TWEAKS = { ...TWEAK_DEFAULTS_SHARED, ...(window.TWEAK_DEFAULTS || {}) };
let editMode = false;

function TweaksPanel() {
  if (!editMode) return '';
  return `
  <div class="fixed bottom-4 right-4 w-[280px] bg-white border border-ink-200 rounded-xl shadow-card-hover z-[10000] overflow-hidden">
    <div class="flex items-center justify-between px-3 py-2 border-b border-ink-100 bg-ink-50">
      <div class="text-xs font-bold tracking-micro uppercase text-ink-700">Tweaks</div>
    </div>
    <div class="p-3 space-y-3 text-sm">
      <label class="block">
        <div class="text-[11px] font-semibold text-ink-600 mb-1 uppercase tracking-micro">Density</div>
        <div class="grid grid-cols-2 gap-1 bg-ink-100 p-1 rounded-lg">
          ${['comfortable','compact'].map(v => `
            <button data-tweak-density="${v}" class="text-xs py-1 rounded-md ${TWEAKS.density===v?'bg-white shadow-sm font-semibold text-ink-900':'text-ink-500'}">${v}</button>`).join('')}
        </div>
      </label>
      <label class="block">
        <div class="text-[11px] font-semibold text-ink-600 mb-1 uppercase tracking-micro">Accent</div>
        <div class="grid grid-cols-4 gap-2">
          ${[['blue','#2563eb'],['indigo','#4f46e5'],['teal','#0d9488'],['rose','#e11d48']].map(([n,c]) => `
            <button data-tweak-accent="${n}" class="h-8 rounded-md border ${TWEAKS.accent===n?'ring-2 ring-ink-900':'border-ink-200'}" style="background:${c}"></button>`).join('')}
        </div>
      </label>
      <label class="flex items-center justify-between gap-2">
        <span class="text-xs text-ink-700">Expanded sidebar</span>
        <button data-tweak-toggle="sidebarExpanded" class="relative h-5 w-9 rounded-full ${TWEAKS.sidebarExpanded?'bg-brand-600':'bg-ink-300'}">
          <span class="absolute top-0.5 ${TWEAKS.sidebarExpanded?'left-4':'left-0.5'} h-4 w-4 rounded-full bg-white shadow transition-all"></span>
        </button>
      </label>
    </div>
  </div>`;
}

function getTheme() {
  try { return localStorage.getItem('rw_theme') || 'sky'; } catch { return 'sky'; }
}
function setTheme(id) {
  try { localStorage.setItem('rw_theme', id); } catch {}
  // Map theme to accent
  const themeAccent = { sky:'sky', light:'blue', dark:'blue' };
  TWEAKS.accent = themeAccent[id] || 'sky';
  applyTweaks();
}

function applyTweaks() {
  // Apply global theme from localStorage before resolving accent
  const storedTheme = getTheme();
  const themeAccent = { sky:'sky', light:'blue', dark:'blue' };
  if (storedTheme in themeAccent) TWEAKS.accent = themeAccent[storedTheme];

  document.body.dataset.density = TWEAKS.density;
  const accentMap = {
    blue:   {50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af'},
    indigo: {50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',800:'#3730a3'},
    teal:   {50:'#f0fdfa',100:'#ccfbf1',200:'#99f6e4',300:'#5eead4',400:'#2dd4bf',500:'#14b8a6',600:'#0d9488',700:'#0f766e',800:'#115e59'},
    rose:   {50:'#fff1f2',100:'#ffe4e6',200:'#fecdd3',300:'#fda4af',400:'#fb7185',500:'#f43f5e',600:'#e11d48',700:'#be123c',800:'#9f1239'},
    sky:    {50:'#f0f9ff',100:'#e0f2fe',200:'#bae6fd',300:'#7dd3fc',400:'#38bdf8',500:'#0ea5e9',600:'#0284c7',700:'#0369a1',800:'#075985'},
  };
  const c = accentMap[TWEAKS.accent] || accentMap.sky;
  let style = document.getElementById('tweak-accent-style');
  if (!style) { style = document.createElement('style'); style.id='tweak-accent-style'; document.head.appendChild(style); }
  style.textContent = `
    :root{--brand-50:${c[50]};--brand-100:${c[100]};--brand-200:${c[200]};--brand-300:${c[300]};--brand-400:${c[400]};--brand-500:${c[500]};--brand-600:${c[600]};--brand-700:${c[700]};--brand-800:${c[800]}}
    .bg-brand-50{background-color:${c[50]}!important}.bg-brand-100{background-color:${c[100]}!important}
    .bg-brand-500{background-color:${c[500]}!important}.bg-brand-600{background-color:${c[600]}!important}
    .bg-brand-700{background-color:${c[700]}!important}
    .text-brand-500{color:${c[500]}!important}.text-brand-600{color:${c[600]}!important}.text-brand-700{color:${c[700]}!important}
    .border-brand-300{border-color:${c[300]}!important}.border-brand-500{border-color:${c[500]}!important}
    .ring-brand-100{--tw-ring-color:${c[100]}!important}
    .hover\\:bg-brand-600:hover{background-color:${c[600]}!important}.hover\\:border-brand-300:hover{border-color:${c[300]}!important}
    .hover\\:text-brand-700:hover{color:${c[700]}!important}
    .via-brand-400{--tw-gradient-stops:var(--tw-gradient-from),${c[400]},var(--tw-gradient-to,transparent)!important}
    .from-brand-400{--tw-gradient-from:${c[400]}!important}.to-brand-600{--tw-gradient-to:${c[600]}!important}
    .nav-item.is-nav-active,.nav-item.is-nav-active:hover{background:${c[600]}!important;color:#fff!important}
    .nav-item.is-nav-active .nav-ico{color:#fff!important}
    .ds-tab-pill{background:${c[600]}!important}
    .ds-page-btn.is-active{background:${c[600]}!important;border-color:${c[600]}!important}
    .topbar-brand-link{color:${c[600]};transition:color 120ms}
    .topbar-brand-link:hover{color:${c[700]}}
  `;
  const sb = document.getElementById('sidebar');
  if (sb) {
    sb.style.width = TWEAKS.sidebarExpanded ? '212px' : '56px';
    sb.dataset.expanded = TWEAKS.sidebarExpanded ? 'true' : 'false';
    document.querySelectorAll('.nav-label').forEach(el => el.classList.toggle('hidden', !TWEAKS.sidebarExpanded));
    // Dismiss any open tooltips when sidebar state changes (avoids flash)
    if (typeof window._dismissNavTips === 'function') window._dismissNavTips();
  }
}

function wireChrome() {
  // Inject a small style block to normalize sidebar icon sizes (some Lucide aliases have
  // h-10 w-10 built in because they're reused as giant category glyphs on the home dashboard).
  if (!document.getElementById('chrome-ico-style')) {
    const s = document.createElement('style');
    s.id = 'chrome-ico-style';
    s.textContent = `.nav-ico svg { width:20px !important; height:20px !important; }
      #sidebar:not([data-expanded="true"]) .nav-item { justify-content:center; padding-left:0; padding-right:0; }
      #sidebar[data-expanded="true"] .nav-item { justify-content:flex-start; }
      #sidebar:not([data-expanded="true"]) .sidebar-logo { display:none !important; }
      #sidebar:not([data-expanded="true"]) > div:first-child { justify-content:center; padding-left:0; padding-right:0; gap:0; }`;
    document.head.appendChild(s);
  }
  // Portal nav tooltips to <body> so they escape sidebar overflow + all stacking contexts.
  // Collect hide fns so applyTweaks can dismiss any open tip on sidebar toggle.
  const _tipHideFns = [];
  document.querySelectorAll('.nav-item').forEach(item => {
    const tip = item.querySelector('.nav-tip');
    if (!tip) return;
    const originalParent = tip.parentNode;
    const show = () => {
      if (TWEAKS.sidebarExpanded) return; // never show tooltips when sidebar is open
      const r = item.getBoundingClientRect();
      document.body.appendChild(tip);
      tip.style.top  = (r.top + r.height/2 - tip.offsetHeight/2) + 'px';
      tip.style.left = (r.right + 10) + 'px';
      tip.style.opacity = '1';
    };
    const hide = () => {
      tip.style.opacity = '0';
      if (tip.parentNode === document.body) originalParent.appendChild(tip);
    };
    _tipHideFns.push(hide);
    item.addEventListener('mouseenter', show);
    item.addEventListener('mouseleave', hide);
  });
  // Expose so applyTweaks can dismiss open tips on sidebar toggle
  window._dismissNavTips = () => _tipHideFns.forEach(fn => fn());
  const collapseBtn = document.getElementById('collapse-btn');
  if (collapseBtn) collapseBtn.onclick = (e) => {
    e.preventDefault();
    TWEAKS.sidebarExpanded = !TWEAKS.sidebarExpanded;
    applyTweaks(); persistTweaks();
  };

  // Mobile drawer
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebarEl = document.getElementById('sidebar');
  const backdropEl = document.getElementById('sidebar-backdrop');
  const openMobile = () => {
    if (!sidebarEl) return;
    sidebarEl.classList.remove('max-md:-translate-x-full');
    sidebarEl.classList.add('max-md:translate-x-0');
    sidebarEl.style.width = '212px';
    sidebarEl.dataset.expanded = 'true';
    // Explicitly enforce left-aligned nav + logo (overrides any CSS that may still target collapsed state)
    const logoEl = sidebarEl.querySelector('.sidebar-logo');
    if (logoEl) { logoEl.style.opacity = '1'; logoEl.style.pointerEvents = 'auto'; logoEl.style.width = ''; logoEl.style.overflow = ''; }
    const headerDiv = sidebarEl.querySelector(':scope>div:first-child');
    if (headerDiv) { headerDiv.style.justifyContent = 'space-between'; headerDiv.style.paddingLeft = '8px'; headerDiv.style.paddingRight = '8px'; headerDiv.style.gap = '8px'; }
    sidebarEl.querySelectorAll('.nav-item').forEach(el => { el.style.justifyContent = 'flex-start'; el.style.paddingLeft = '8px'; el.style.paddingRight = '8px'; });
    document.querySelectorAll('.nav-label').forEach(el => el.classList.remove('hidden'));
    if (backdropEl) backdropEl.classList.remove('hidden');
  };
  const closeMobile = () => {
    if (!sidebarEl) return;
    sidebarEl.classList.add('max-md:-translate-x-full');
    sidebarEl.classList.remove('max-md:translate-x-0');
    if (backdropEl) backdropEl.classList.add('hidden');
    // Clear inline style overrides so applyTweaks re-applies correct state
    const logoEl = sidebarEl.querySelector('.sidebar-logo');
    if (logoEl) { logoEl.style.opacity = ''; logoEl.style.pointerEvents = ''; logoEl.style.width = ''; logoEl.style.overflow = ''; }
    const headerDiv = sidebarEl.querySelector(':scope>div:first-child');
    if (headerDiv) { headerDiv.style.justifyContent = ''; headerDiv.style.paddingLeft = ''; headerDiv.style.paddingRight = ''; headerDiv.style.gap = ''; }
    sidebarEl.querySelectorAll('.nav-item').forEach(el => { el.style.justifyContent = ''; el.style.paddingLeft = ''; el.style.paddingRight = ''; });
    applyTweaks();
  };
  if (mobileMenuBtn) mobileMenuBtn.onclick = (e) => { e.stopPropagation(); openMobile(); };
  if (backdropEl) backdropEl.onclick = closeMobile;
  const notifBtn = document.getElementById('notif-btn');
  const notifPop = document.getElementById('notif-pop');
  const userBtn  = document.getElementById('user-btn');
  const userPop  = document.getElementById('user-pop');
  function closeAll(except) {
    if (notifPop && except!==notifPop) notifPop.classList.add('hidden');
    if (userPop  && except!==userPop)  userPop.classList.add('hidden');
  }
  if (notifBtn) notifBtn.onclick = (e) => { e.stopPropagation(); closeAll(notifPop); notifPop.classList.toggle('hidden'); };
  if (userBtn)  userBtn.onclick  = (e) => { e.stopPropagation(); closeAll(userPop);  userPop.classList.toggle('hidden'); };
  document.addEventListener('click', () => closeAll());

  document.querySelectorAll('[data-tweak-density]').forEach(b => b.onclick = () => {
    TWEAKS.density = b.dataset.tweakDensity; if (window.render) window.render(); applyTweaks(); persistTweaks();
  });
  document.querySelectorAll('[data-tweak-accent]').forEach(b => b.onclick = () => {
    TWEAKS.accent = b.dataset.tweakAccent; if (window.render) window.render(); applyTweaks(); persistTweaks();
  });
  document.querySelectorAll('[data-tweak-toggle]').forEach(b => b.onclick = () => {
    const k = b.dataset.tweakToggle;
    TWEAKS[k] = !TWEAKS[k]; if (window.render) window.render(); applyTweaks(); persistTweaks();
  });

  applyTweaks();
}

function persistTweaks() {
  try { window.parent.postMessage({ type:'__edit_mode_set_keys', edits: TWEAKS }, '*'); } catch {}
}

window.addEventListener('message', (e) => {
  const d = e.data || {};
  if (d.type === '__activate_edit_mode')   { editMode = true;  if (window.render) window.render(); }
  if (d.type === '__deactivate_edit_mode') { editMode = false; if (window.render) window.render(); }
});
try { window.parent.postMessage({ type:'__edit_mode_available' }, '*'); } catch {}

/* helpers */
function sparkline(series, { w=120, h=28, color='currentColor', fill=true } = {}) {
  const min = Math.min(...series), max = Math.max(...series);
  const span = max - min || 1;
  const step = w / (series.length - 1);
  const pts = series.map((v,i) => [i*step, h - ((v-min)/span) * (h-4) - 2]);
  const line = pts.map((p,i) => (i===0?'M':'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L ${w} ${h} L 0 ${h} Z`;
  return `<svg viewBox="0 0 ${w} ${h}" class="overflow-visible" preserveAspectRatio="none" width="${w}" height="${h}">
    ${fill?`<path d="${area}" fill="${color}" opacity=".08"/>`:''}
    <path d="${line}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}
window.sharedChrome = { Sidebar, Topbar, TweaksPanel, wireChrome, applyTweaks, setTheme, getTheme, I, sparkline, toneClasses, NAV };
