import { useState, useRef, type KeyboardEvent } from 'react'
import { Head } from '@inertiajs/react'
import { Search, Copy, ExternalLink, Check, Download } from 'lucide-react'
import { toast } from 'sonner'
import { DORK_CATEGORIES, TOTAL_DORKS, type DorkCategory } from '~/data/dorks'
import { useLanguage } from '~/context/language'

function resolveDork(template: string, domain: string): string {
  return template.replace(/DOMAIN/g, domain)
}

/* ── Individual dork row ── */
function DorkRow({
  template,
  displayDomain,
  isDomainSet,
  onNeedDomain,
}: {
  template: string
  displayDomain: string
  isDomainSet: boolean
  onNeedDomain: () => void
}) {
  const [copied, setCopied] = useState(false)
  const { t } = useLanguage()
  const dork = resolveDork(template, displayDomain)

  const copy = async () => {
    if (!isDomainSet) { onNeedDomain(); return }
    await navigator.clipboard.writeText(dork)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const open = () => {
    if (!isDomainSet) { onNeedDomain(); return }
    window.open(`https://www.google.com/search?q=${encodeURIComponent(dork)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-edge/30 last:border-0 hover:bg-blue-brand/[0.04] transition-colors group">
      <span className="flex-1 font-mono text-xs leading-relaxed break-all text-cream/75 group-hover:text-cream transition-colors">
        {dork}
      </span>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={copy}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all cursor-pointer ${
            copied
              ? 'bg-green-500/15 border-green-500/40 text-green-400'
              : 'bg-bg-secondary border-edge hover:border-blue-brand/50 hover:bg-blue-brand/10 text-mute hover:text-blue-brand'
          }`}
        >
          {copied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
          {copied ? t.home.copied : 'Copy'}
        </button>
        <button
          onClick={open}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono border border-edge bg-bg-secondary hover:border-blue-brand/50 hover:bg-blue-brand/10 text-mute hover:text-blue-brand transition-all cursor-pointer"
        >
          <ExternalLink className="w-2.5 h-2.5" />
          Open
        </button>
      </div>
    </div>
  )
}

/* ── Category panel (all dorks) ── */
function CategoryPanel({
  category,
  displayDomain,
  isDomainSet,
  onNeedDomain,
}: {
  category: DorkCategory
  displayDomain: string
  isDomainSet: boolean
  onNeedDomain: () => void
}) {
  const { t } = useLanguage()

  const copyAll = async () => {
    if (!isDomainSet) { onNeedDomain(); return }
    const all = category.templates.map((tmpl) => resolveDork(tmpl, displayDomain)).join('\n')
    await navigator.clipboard.writeText(all)
    toast.success(`${category.templates.length} ${t.home.copiedAll}`)
  }

  return (
    <div>
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-bg-secondary border border-edge rounded-t-2xl">
        <div className="flex items-center gap-3">
          <span className="text-xl">{category.emoji}</span>
          <div>
            <h2 className="font-bold text-base text-cream font-mono">{t.home.categoryNames[category.id] ?? category.name}</h2>
            <p className="text-xs text-mute font-mono">{category.templates.length} {t.home.dorks}</p>
          </div>
        </div>
        <button
          onClick={copyAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-edge bg-bg-card hover:border-blue-brand/50 hover:bg-blue-brand/10 text-dim hover:text-blue-brand transition-all cursor-pointer text-xs font-mono font-medium"
        >
          <Copy className="w-3.5 h-3.5" />
          {t.home.copyCategory} ({category.templates.length})
        </button>
      </div>

      {/* Dork list */}
      <div className="bg-bg-card border-x border-b border-edge rounded-b-2xl overflow-hidden">
        {category.templates.map((template, i) => (
          <DorkRow
            key={i}
            template={template}
            displayDomain={displayDomain}
            isDomainSet={isDomainSet}
            onNeedDomain={onNeedDomain}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Main page ── */
export default function Home() {
  const [domain, setDomain] = useState('')
  const [activeTab, setActiveTab] = useState(DORK_CATEGORIES[0].id)
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()

  const isDomainSet = !!domain.trim()
  const displayDomain = domain.trim() || 'example.com'
  const activeCategory = DORK_CATEGORIES.find((c) => c.id === activeTab) ?? DORK_CATEGORIES[0]

  const onNeedDomain = () => {
    toast.error(t.home.needDomain, { description: t.home.needDomainDesc })
    inputRef.current?.focus()
    inputRef.current?.select()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') inputRef.current?.blur()
  }

  const copyAll = async () => {
    if (!isDomainSet) { onNeedDomain(); return }
    const all = DORK_CATEGORIES.flatMap((cat) =>
      cat.templates.map((tmpl) => resolveDork(tmpl, displayDomain))
    ).join('\n')
    await navigator.clipboard.writeText(all)
    toast.success(`${TOTAL_DORKS} ${t.home.copiedAll}`)
  }

  const downloadTxt = () => {
    if (!isDomainSet) { onNeedDomain(); return }
    const lines = DORK_CATEGORIES.map((cat) =>
      `=== ${cat.emoji} ${cat.name} (${cat.templates.length}) ===\n` +
      cat.templates.map((tmpl) => resolveDork(tmpl, displayDomain)).join('\n')
    ).join('\n\n')
    const blob = new Blob([lines], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dorks-${displayDomain}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(t.home.downloaded)
  }

  return (
    <>
    <Head>
      <title>{t.seo.home.title}</title>
      <meta name="description" content={t.seo.home.description} />
      <meta property="og:title" content={t.seo.home.title} />
      <meta property="og:description" content={t.seo.home.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://dorker.sentrak.info/" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t.seo.home.title} />
      <meta name="twitter:description" content={t.seo.home.description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://dorker.sentrak.info/" />
    </Head>
    <div className="pt-16">
      {/* ── Top bar ── */}
      <div className="sticky top-16 z-30 bg-bg-dark/95 backdrop-blur-xl border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <img src="/logo.png" alt="Dorker" className="w-5 h-5 object-contain" />
              <span className="font-mono font-bold text-blue-brand text-sm hidden sm:block">DORKER</span>
            </div>

            {/* Domain input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mute" />
              <input
                ref={inputRef}
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={t.home.placeholder}
                className="w-full bg-bg-secondary border border-edge rounded-xl pl-9 pr-4 py-2.5 text-cream font-mono text-sm placeholder:text-mute focus:outline-none focus:border-blue-brand/60 focus:ring-1 focus:ring-blue-brand/20 transition-all"
              />
            </div>

            {/* Status badge */}
            {isDomainSet ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-brand/10 border border-blue-brand/25 rounded-xl flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-brand animate-pulse" />
                <span className="font-mono text-xs text-blue-brand font-bold">{displayDomain}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-bg-card border border-edge rounded-xl flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-mute" />
                <span className="font-mono text-xs text-mute">{t.home.noDomain}</span>
              </div>
            )}

            {/* Download .txt */}
            <button
              onClick={downloadTxt}
              disabled={!isDomainSet}
              className="flex items-center gap-2 px-4 py-2.5 bg-bg-card border border-edge hover:border-blue-brand/50 hover:bg-blue-brand/10 text-dim hover:text-blue-brand rounded-xl font-bold font-mono text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              {t.home.download}
            </button>

            {/* Copy all */}
            <button
              onClick={copyAll}
              disabled={!isDomainSet}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-brand hover:bg-blue-dim text-bg-dark rounded-xl font-bold font-mono text-xs transition-all hover:shadow-[0_2px_16px_rgba(0,212,255,0.3)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
              {t.home.copyAll} ({TOTAL_DORKS})
            </button>
          </div>
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {DORK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer border ${
                activeTab === cat.id
                  ? 'bg-blue-brand text-bg-dark border-transparent shadow-[0_2px_16px_rgba(0,212,255,0.25)] font-bold'
                  : 'bg-bg-card border-edge text-dim hover:text-cream hover:border-edge-hover hover:bg-bg-card-hover'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{t.home.categoryNames[cat.id] ?? cat.name}</span>
              <span className={`${activeTab === cat.id ? 'text-bg-dark/60' : 'text-mute'}`}>
                ({cat.templates.length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Active category dorks ── */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <CategoryPanel
          category={activeCategory}
          displayDomain={displayDomain}
          isDomainSet={isDomainSet}
          onNeedDomain={onNeedDomain}
        />
      </div>
    </div>
    </>
  )
}
