/* Login screen — passwordless. Click Sign In to enter the Dashboard. */
const { useState, useEffect, useRef } = React;

const SLIDES = [
  { kind: 'Marine',   img: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=2400&q=80', tag: 'Marine'   },
  { kind: 'Property', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=2400&q=80', tag: 'Property' },
  { kind: 'Aviation', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2400&q=80', tag: 'Aviation' },
  { kind: 'Energy',   img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2400&q=80', tag: 'Energy'   },
];

function LoginScreen() {
  const [idx, setIdx] = useState(0);
  const [signing, setSigning] = useState(false);

  // Cycle every 6s
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const onSignIn = (e) => {
    e.preventDefault();
    setSigning(true);
    setTimeout(() => { window.location.href = 'Dashboard.html'; }, 600);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-ink-900">
      {/* Background slides w/ Ken Burns */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => (
          <div
            key={s.kind}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${i === idx ? 'opacity-100' : 'opacity-0'}`}
          >
            <div
              className={`absolute inset-0 bg-center bg-cover ${i === idx ? 'kb-active' : ''}`}
              style={{ backgroundImage: `url('${s.img}')` }}
            />
          </div>
        ))}
        {/* Vignette */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(8,15,30,.55) 0%, rgba(8,15,30,.35) 40%, rgba(8,15,30,.85) 100%)' }} />
      </div>

      {/* Top bar — brand */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2.5 text-white">
          <div className="h-8 w-8 rounded-lg bg-white/15 backdrop-blur-md ring-1 ring-white/30 flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>
          </div>
          <div className="leading-none">
            <div className="text-[15px] font-extrabold tracking-tight" style={{ fontFamily: 'Exo, sans-serif' }}>REAL WORLD</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Risk Intelligence</div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-white/80 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"/>
          <span>All systems operational</span>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 px-8 lg:px-16 pt-8 pb-20">
        {/* Left — copy + slide indicator */}
        <div className="text-white max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20 text-[11px] font-semibold uppercase tracking-[0.2em]">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" style={{ background: '#60a5fa' }}/>
            <span key={idx} className="kb-fadein">{SLIDES[idx].tag}</span>
          </div>
          <h1
            className="mt-6 text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight"
            style={{ fontFamily: 'Exo, sans-serif' }}
          >
            See every risk,<br/>
            <span className="text-white/70">across every line.</span>
          </h1>
          <p className="mt-5 text-base lg:text-lg text-white/80 max-w-md leading-relaxed">
            Marine, Property, Aviation, and Energy portfolios — unified on one global map. Real-time exposure, live alerts, deep portfolio analytics.
          </p>
          <div className="mt-10 flex items-center gap-3">
            {SLIDES.map((s, i) => (
              <button
                key={s.kind}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-10 bg-white' : 'w-6 bg-white/40 hover:bg-white/60'}`}
                aria-label={`Show ${s.kind}`}
              />
            ))}
          </div>
        </div>

        {/* Right — login card */}
        <div className="flex lg:justify-end items-start lg:items-center">
          <form
            onSubmit={onSignIn}
            className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-white/40 p-8"
          >
            <div className="flex items-center gap-2 text-ink-500 text-[11px] font-bold uppercase tracking-[0.18em]">
              <span className="h-px w-6 bg-ink-300"/> Sign in
            </div>
            <h2 className="mt-2 text-2xl font-extrabold text-ink-900" style={{ fontFamily: 'Exo, sans-serif' }}>
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-ink-500">Continue to your risk dashboard.</p>

            <div className="mt-6 space-y-3.5">
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-600">Email</span>
                <input
                  type="email"
                  defaultValue="paul.kiernan@realworld.com"
                  className="mt-1.5 w-full h-11 rounded-lg border border-ink-200 bg-white px-3.5 text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </label>
              <label className="block">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-600">Password</span>
                  <a className="text-[11px] font-semibold text-brand-600 hover:text-brand-700">Forgot?</a>
                </div>
                <input
                  type="password"
                  defaultValue="••••••••••"
                  className="mt-1.5 w-full h-11 rounded-lg border border-ink-200 bg-white px-3.5 text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </label>

              <label className="flex items-center gap-2 pt-1">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-ink-300 accent-brand-600"/>
                <span className="text-xs text-ink-600">Keep me signed in on this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={signing}
              className={`mt-6 w-full h-11 rounded-lg font-semibold text-white text-sm transition-all flex items-center justify-center gap-2 ${signing ? 'bg-brand-700 cursor-wait' : 'bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-600/30'}`}
            >
              {signing ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity=".3" strokeWidth="3"/><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </>
              )}
            </button>

            <div className="mt-5 flex items-center gap-3 text-[11px] text-ink-400">
              <div className="flex-1 h-px bg-ink-200"/>
              <span>OR</span>
              <div className="flex-1 h-px bg-ink-200"/>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button type="button" className="h-10 rounded-lg border border-ink-200 bg-white hover:bg-ink-50 text-xs font-semibold text-ink-700 flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 8 3l5.7-5.7C34.6 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 8 3l5.7-5.7C34.6 6.5 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.6 27 35.5 24 35.5c-5.3 0-9.7-3.4-11.3-8L6 32.4C9.4 39.5 16.1 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.6 5.6c-.5.4 7-5.2 7-15.3 0-1.3-.1-2.4-.4-3.5z"/></svg>
                SSO
              </button>
              <button type="button" className="h-10 rounded-lg border border-ink-200 bg-white hover:bg-ink-50 text-xs font-semibold text-ink-700 flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85V21c0 .26.18.58.69.48A10 10 0 0 0 12 2z"/></svg>
                SAML
              </button>
            </div>

            <p className="mt-6 text-[11px] text-ink-400 text-center">
              By continuing, you agree to our <a className="font-semibold text-ink-600 hover:text-ink-800">Terms</a> and <a className="font-semibold text-ink-600 hover:text-ink-800">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </main>

      <footer className="relative z-10 px-8 pb-6 flex items-center justify-between text-[11px] text-white/60">
        <span>© 2026 Real World Risk Intelligence</span>
        <div className="flex items-center gap-4">
          <a className="hover:text-white">Status</a>
          <a className="hover:text-white">Support</a>
          <a className="hover:text-white">Docs</a>
        </div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<LoginScreen/>);
