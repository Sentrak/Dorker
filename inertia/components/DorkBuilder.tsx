import { useState } from 'react'
import { Copy, ExternalLink, X, ChevronDown, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import DorkHighlight from './DorkHighlight'

export interface DorkState {
  query: string
  site: string
  filetype: string
  intitle: string
  inurl: string
  intext: string
  ext: string
  cache: string
  exclude: string
}

export const defaultDorkState: DorkState = {
  query: '',
  site: '',
  filetype: '',
  intitle: '',
  inurl: '',
  intext: '',
  ext: '',
  cache: '',
  exclude: '',
}

export function buildDorkQuery(state: DorkState): string {
  const parts: string[] = []
  if (state.query.trim()) parts.push(state.query.trim())
  if (state.site.trim()) parts.push(`site:${state.site.trim()}`)
  if (state.filetype.trim()) parts.push(`filetype:${state.filetype.trim()}`)
  if (state.intitle.trim()) parts.push(`intitle:"${state.intitle.trim()}"`)
  if (state.inurl.trim()) parts.push(`inurl:${state.inurl.trim()}`)
  if (state.intext.trim()) parts.push(`intext:"${state.intext.trim()}"`)
  if (state.ext.trim()) parts.push(`ext:${state.ext.trim()}`)
  if (state.cache.trim()) parts.push(`cache:${state.cache.trim()}`)
  if (state.exclude.trim()) {
    state.exclude
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .forEach((term) => parts.push(`-${term}`))
  }
  return parts.join(' ')
}

const FILETYPES = ['pdf', 'docx', 'xlsx', 'csv', 'sql', 'log', 'env', 'txt', 'json', 'xml', 'php', 'js', 'bak', 'cfg']

const OPERATOR_FIELDS: {
  key: keyof Omit<DorkState, 'query'>
  label: string
  placeholder: string
  desc: string
  isFiletype?: boolean
}[] = [
  { key: 'site', label: 'site:', placeholder: 'exemple.com', desc: 'Limiter à un domaine' },
  { key: 'filetype', label: 'filetype:', placeholder: 'pdf, sql...', desc: 'Type de fichier', isFiletype: true },
  { key: 'intitle', label: 'intitle:', placeholder: 'mot dans le titre', desc: 'Mots dans le titre' },
  { key: 'inurl', label: 'inurl:', placeholder: '/admin/login', desc: "Mots dans l'URL" },
  { key: 'intext', label: 'intext:', placeholder: 'mot dans le contenu', desc: 'Mots dans le contenu' },
  { key: 'ext', label: 'ext:', placeholder: 'php, asp...', desc: 'Extension du fichier' },
  { key: 'cache', label: 'cache:', placeholder: 'exemple.com', desc: 'Version en cache Google' },
  { key: 'exclude', label: '–', placeholder: 'termes à exclure', desc: 'Exclure des termes (espaces entre chaque)' },
]

interface Props {
  state: DorkState
  onChange: (state: DorkState) => void
}

export default function DorkBuilder({ state, onChange }: Props) {
  const [filetypeOpen, setFiletypeOpen] = useState(false)

  const update = (key: keyof DorkState, value: string) => onChange({ ...state, [key]: value })

  const dork = buildDorkQuery(state)
  const isEmpty = !dork

  const copyDork = async () => {
    if (isEmpty) { toast.error('La requête est vide'); return }
    await navigator.clipboard.writeText(dork)
    toast.success('Requête copiée dans le presse-papiers !')
  }

  const openInGoogle = () => {
    if (isEmpty) { toast.error('La requête est vide'); return }
    window.open(`https://www.google.com/search?q=${encodeURIComponent(dork)}`, '_blank', 'noopener,noreferrer')
  }

  const reset = () => onChange(defaultDorkState)

  return (
    <div className="space-y-7">
      {/* ── Terme principal ── */}
      <div>
        <label className="block text-sm font-semibold text-cream mb-2">
          Terme de recherche principal
        </label>
        <input
          type="text"
          value={state.query}
          onChange={(e) => update('query', e.target.value)}
          placeholder="Que cherchez-vous ?"
          className="w-full bg-bg-secondary border border-edge rounded-xl px-4 py-3 text-cream placeholder:text-mute focus:outline-none focus:border-amber-brand/50 focus:ring-1 focus:ring-amber-brand/20 transition-all font-mono text-sm"
        />
      </div>

      {/* ── Opérateurs ── */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-mute mb-4">Opérateurs avancés</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OPERATOR_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="flex items-center gap-2 mb-2">
                <span className="font-mono text-amber-brand font-bold text-sm">{field.label}</span>
                <span className="text-mute text-xs">{field.desc}</span>
              </label>

              {field.isFiletype ? (
                <div className="relative">
                  <input
                    type="text"
                    value={state[field.key]}
                    onChange={(e) => update(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-bg-secondary border border-edge rounded-xl px-4 py-3 pr-10 text-cream placeholder:text-mute focus:outline-none focus:border-amber-brand/50 focus:ring-1 focus:ring-amber-brand/20 transition-all font-mono text-sm"
                  />
                  <button
                    onClick={() => setFiletypeOpen((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dim hover:text-cream transition-colors cursor-pointer"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${filetypeOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {filetypeOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-bg-card border border-edge rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-20">
                      <div className="flex flex-wrap gap-1.5 p-3">
                        {FILETYPES.map((ft) => (
                          <button
                            key={ft}
                            onClick={() => { update('filetype', ft); setFiletypeOpen(false) }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                              state.filetype === ft
                                ? 'bg-amber-brand text-bg-dark font-bold'
                                : 'bg-bg-secondary text-dim hover:text-cream hover:bg-bg-card-hover border border-edge'
                            }`}
                          >
                            {ft}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={state[field.key]}
                    onChange={(e) => update(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-bg-secondary border border-edge rounded-xl px-4 py-3 pr-9 text-cream placeholder:text-mute focus:outline-none focus:border-amber-brand/50 focus:ring-1 focus:ring-amber-brand/20 transition-all font-mono text-sm"
                  />
                  {state[field.key] && (
                    <button
                      onClick={() => update(field.key, '')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-dim transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Terminal preview ── */}
      <div className="rounded-2xl border border-edge bg-bg-secondary overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-edge bg-bg-card/60">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <span className="text-xs font-mono text-mute ml-2">google.com › search?q=</span>
        </div>
        <div className="px-5 py-5 min-h-[68px] font-mono text-sm leading-relaxed break-all">
          {dork ? (
            <DorkHighlight dork={dork} />
          ) : (
            <span className="text-mute">
              Votre requête Google Dork apparaîtra ici...
              <span className="terminal-cursor" />
            </span>
          )}
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={openInGoogle}
          disabled={isEmpty}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-brand hover:bg-amber-dim text-bg-dark rounded-xl font-semibold text-sm transition-all hover:shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          Rechercher sur Google
        </button>
        <button
          onClick={copyDork}
          disabled={isEmpty}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-bg-card border border-edge hover:border-edge-hover hover:bg-bg-card-hover text-cream rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
        >
          <Copy className="w-4 h-4" />
          Copier la requête
        </button>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-dim hover:text-cream border border-edge hover:border-edge-hover rounded-xl text-sm transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Réinitialiser
        </button>
      </div>
    </div>
  )
}
