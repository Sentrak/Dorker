import { ReactNode, useState, useEffect, useRef } from 'react'
import { usePage } from '@inertiajs/react'
import { Toaster, toast } from 'sonner'
import { Menu, X, ChevronDown } from 'lucide-react'
import type { Data } from '@generated/data'
import { useLanguage } from '~/context/language'
import { LOCALES, LOCALE_LABELS } from '~/i18n/types'

export default function AppLayout({ children }: { children: ReactNode }) {
  const { component, props } = usePage<Data.SharedProps>()
  const { locale, setLocale, t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    if (props.flash?.error) toast.error(props.flash.error)
    if (props.flash?.success) toast.success(props.flash.success)
  })

  const activePage = component?.toLowerCase()

  return (
    <div className="noise-overlay dark-scroll min-h-screen bg-bg-dark text-cream font-sans antialiased overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
          scrolled || menuOpen
            ? 'backdrop-blur-xl bg-bg-dark/90 border-edge shadow-[0_1px_24px_rgba(0,0,0,0.3)]'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 font-mono font-bold text-xl text-cream hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Dorker" className="w-9 h-9 object-contain" />
            DORKER
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {/* Guide link */}
            <a
              href="/learn"
              className={`text-sm font-medium transition-colors ${
                activePage === 'learn' ? 'text-cream' : 'text-dim hover:text-cream'
              }`}
            >
              {t.nav.guide}
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/Sentrak/Dorker"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-edge hover:border-edge-hover bg-bg-card hover:bg-bg-card-hover text-dim hover:text-cream transition-all text-sm font-medium"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </a>

            {/* Language switcher */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1.5 text-sm font-medium text-dim hover:text-cream transition-colors cursor-pointer"
              >
                <span className="font-mono uppercase text-xs">{locale}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 bg-bg-card border border-edge rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] min-w-[140px] z-50">
                  {LOCALES.map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLocale(l); setLangOpen(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2.5 cursor-pointer ${
                        l === locale
                          ? 'text-blue-brand bg-blue-brand/8'
                          : 'text-dim hover:text-cream hover:bg-bg-card-hover'
                      }`}
                    >
                      <span className="font-mono text-xs uppercase opacity-60 w-5">{l}</span>
                      {LOCALE_LABELS[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <a
              href="/"
              className="px-5 py-2 bg-blue-brand hover:bg-blue-dim text-bg-dark rounded-full text-sm font-semibold font-mono transition-all hover:shadow-[0_0_24px_rgba(0,212,255,0.35)] hover:-translate-y-px"
            >
              {t.nav.cta}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-dim hover:text-cream transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMenuOpen(false)} />}

      {/* Mobile menu panel */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 md:hidden bg-bg-dark border-b border-edge transition-all duration-300 ${
          menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
          <a
            href="/learn"
            onClick={() => setMenuOpen(false)}
            className={`px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
              activePage === 'learn' ? 'text-cream bg-white/[0.05]' : 'text-dim hover:text-cream hover:bg-white/[0.03]'
            }`}
          >
            {t.nav.guide}
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/Sentrak/Dorker"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-dim hover:text-cream hover:bg-white/[0.03] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            GitHub
          </a>

          <div className="border-t border-edge my-2" />

          {/* Mobile lang switcher */}
          <div className="border-t border-edge my-1 pt-3">
            <p className="px-3 text-[11px] font-mono uppercase tracking-widest text-mute mb-2">
              Language
            </p>
            <div className="flex gap-2">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  onClick={() => { setLocale(l); setMenuOpen(false) }}
                  className={`flex-1 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer border ${
                    l === locale
                      ? 'bg-blue-brand/10 border-blue-brand/30 text-blue-brand'
                      : 'bg-bg-card border-edge text-dim hover:text-cream'
                  }`}
                >
                  <span className="uppercase">{l}</span>
                  <span className="block text-[10px] opacity-60 mt-0.5">{LOCALE_LABELS[l]}</span>
                </button>
              ))}
            </div>
          </div>

          <a
            href="/"
            onClick={() => setMenuOpen(false)}
            className="w-full py-3 bg-blue-brand hover:bg-blue-dim text-bg-dark rounded-full text-sm font-semibold font-mono text-center transition-all mt-1"
          >
            {t.nav.cta}
          </a>
        </div>
      </div>

      {/* Page content */}
      {children}

      {/* ── Footer ── */}
      <footer className="border-t border-edge">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
          <div className="flex flex-wrap justify-between gap-10">
            {/* Brand */}
            <div className="max-w-[260px]">
              <a href="/" className="flex items-center gap-2 font-mono font-bold text-lg text-blue-brand mb-3">
                <img src="/logo.png" alt="Dorker" className="w-7 h-7 object-contain" />
                DORKER
              </a>
              <p className="text-mute text-[13px] leading-relaxed">{t.footer.description}</p>
            </div>

            {/* Columns */}
            <div className="flex gap-14 flex-wrap">
              {/* Tool */}
              <div>
                <h5 className="text-[11px] uppercase tracking-[2px] text-mute font-semibold mb-4">
                  {t.footer.columns.tool.title}
                </h5>
                <ul className="space-y-2">
                  {[{ label: t.footer.columns.tool.links[0], href: '/' }, { label: t.footer.columns.tool.links[1], href: '/apprendre' }].map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} className="text-dim hover:text-cream text-sm transition-colors">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h5 className="text-[11px] uppercase tracking-[2px] text-mute font-semibold mb-4">
                  {t.footer.columns.resources.title}
                </h5>
                <ul className="space-y-2">
                  {[
                    { label: t.footer.columns.resources.links[0], href: 'https://www.exploit-db.com/google-hacking-database' },
                    { label: t.footer.columns.resources.links[1], href: 'https://osintframework.com' },
                    { label: t.footer.columns.resources.links[2], href: 'https://tryhackme.com' },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-dim hover:text-cream text-sm transition-colors">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h5 className="text-[11px] uppercase tracking-[2px] text-mute font-semibold mb-4">
                  {t.footer.columns.legal.title}
                </h5>
                <ul className="space-y-2">
                  {[
                    { label: t.footer.columns.legal.links[0], href: '/apprendre' },
                    { label: t.footer.columns.legal.links[1], href: 'https://github.com' },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} className="text-dim hover:text-cream text-sm transition-colors">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-edge flex flex-wrap justify-between items-center gap-3 text-[12px] text-mute">
            <span>{t.footer.copyright}</span>
            <span>
              {t.footer.tagline}{' '}·{' '}Built by{' '}
              <a
                href="https://sentrak.info"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream transition-colors"
              >
                sentrak.info
              </a>
            </span>
          </div>
        </div>
      </footer>

      <Toaster position="top-center" richColors />
    </div>
  )
}
