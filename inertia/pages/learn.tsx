import { useEffect, useRef, type RefObject } from 'react'
import { Head } from '@inertiajs/react'
import { BookOpen, AlertTriangle, CheckCircle, Terminal, Search, Shield, Scale } from 'lucide-react'
import { useLanguage } from '~/context/language'

function useFadeUp(): RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect() } },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref as RefObject<HTMLDivElement>
}

const PRACTICE_ICONS = [Shield, BookOpen, AlertTriangle, Scale, Terminal, CheckCircle]

export default function Learn() {
  const opsRef = useFadeUp()
  const practicesRef = useFadeUp()
  const { t } = useLanguage()

  return (
    <>
    <Head>
      <title>{t.seo.learn.title}</title>
      <meta name="description" content={t.seo.learn.description} />
      <meta property="og:title" content={t.seo.learn.title} />
      <meta property="og:description" content={t.seo.learn.description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content="https://dorker.sentrak.info/learn" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t.seo.learn.title} />
      <meta name="twitter:description" content={t.seo.learn.description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://dorker.sentrak.info/learn" />
    </Head>
    <div className="pt-16">
      {/* ── Header ── */}
      <section className="pt-14 pb-10 border-b border-edge">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-bg-card border border-edge rounded-full text-sm font-medium text-blue-brand mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            {t.learn.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-1.5px] mb-3">
            {t.learn.title}
          </h1>
          <p className="text-dim text-lg">{t.learn.subtitle}</p>
        </div>
      </section>

      {/* ── What is Dorking ── */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-6 space-y-4 text-dim leading-relaxed">
          <h2 className="text-2xl font-bold text-cream mb-5">{t.learn.whatIsTitle}</h2>
          {t.learn.whatIs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}

          <div className="mt-8 bg-red-500/8 border border-red-500/25 rounded-2xl p-6 flex gap-4">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-400 mb-2">{t.learn.warning}</h3>
              <p className="text-sm leading-relaxed">{t.learn.warningBody}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Operators ── */}
      <section className="py-14 bg-bg-secondary border-y border-edge">
        <div ref={opsRef} className="fade-up max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-cream mb-7">{t.learn.operatorsTitle}</h2>
          <div className="space-y-3">
            {t.learn.operators.map((op, i) => (
              <div key={i} className="bg-bg-card border border-edge rounded-xl p-5 flex gap-5">
                <div className="w-10 h-10 bg-blue-brand/10 border border-blue-brand/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Terminal className="w-4 h-4 text-blue-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                    <code className="font-mono font-bold text-blue-brand text-sm bg-blue-brand/10 px-2.5 py-0.5 rounded-lg">
                      {op.op}
                    </code>
                    <code className="font-mono text-xs text-dim bg-bg-secondary px-2.5 py-0.5 rounded-lg border border-edge">
                      {op.example}
                    </code>
                  </div>
                  <p className="text-sm text-dim leading-relaxed">{op.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Example ── */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">{t.learn.exampleTitle}</h2>
          <div className="bg-bg-card border border-edge rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-edge bg-bg-secondary">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <span className="text-xs font-mono text-mute ml-2">{t.learn.exampleTitle}</span>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs font-mono text-mute uppercase tracking-widest mb-3">Query</p>
                <code className="block font-mono text-blue-brand text-sm bg-bg-secondary rounded-xl px-5 py-4 border border-edge leading-relaxed break-all">
                  {t.learn.exampleQuery}
                </code>
              </div>
              <div className="space-y-2">
                {t.learn.decomp.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <code className="font-mono text-xs text-blue-brand bg-blue-brand/8 px-2 py-0.5 rounded flex-shrink-0 mt-0.5">
                      {item.op}
                    </code>
                    <span className="text-sm text-dim">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Best practices ── */}
      <section className="py-14 bg-bg-secondary border-y border-edge">
        <div ref={practicesRef} className="fade-up max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-cream mb-7">{t.learn.practicesTitle}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {t.learn.practices.map(({ title, desc }, i) => {
              const Icon = PRACTICE_ICONS[i] ?? Shield
              return (
                <div key={i} className="bg-bg-card border border-edge rounded-xl p-5 flex gap-4">
                  <div className="w-9 h-9 bg-blue-brand/10 border border-blue-brand/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-blue-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1.5">{title}</h3>
                    <p className="text-xs text-dim leading-relaxed">{desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 text-center">
        <div className="max-w-md mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4">{t.learn.ctaTitle}</h2>
          <p className="text-dim mb-8 text-sm">{t.learn.ctaSubtitle}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-brand hover:bg-blue-dim text-bg-dark rounded-full font-semibold transition-all hover:shadow-[0_4px_28px_rgba(0,212,255,0.3)] hover:-translate-y-0.5"
          >
            <Search className="w-5 h-5" />
            {t.learn.ctaBtn}
          </a>
        </div>
      </section>
    </div>
    </>
  )
}
