import { useState } from 'react'
import { Terminal, Sparkles } from 'lucide-react'
import DorkBuilder, { defaultDorkState, type DorkState } from '~/components/DorkBuilder'
import DorkPresets from '~/components/DorkPresets'

export default function Generator() {
  const [dorkState, setDorkState] = useState<DorkState>(defaultDorkState)

  const handlePresetSelect = (preset: Partial<DorkState>) => {
    setDorkState({ ...defaultDorkState, ...preset })
    document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="pt-16">
      {/* ── Header ── */}
      <section className="pt-14 pb-10 border-b border-edge">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-bg-card border border-edge rounded-full text-sm font-medium text-amber-brand mb-5">
            <Terminal className="w-3.5 h-3.5" />
            Générateur de Dorks
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-1.5px] mb-3">
            Construisez votre requête
          </h1>
          <p className="text-dim text-lg max-w-xl">
            Combinez les opérateurs Google pour créer des requêtes de recherche précises et
            puissantes.
          </p>
        </div>
      </section>

      {/* ── Builder ── */}
      <section id="builder" className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-bg-card border border-edge rounded-2xl p-6 md:p-10">
            <DorkBuilder state={dorkState} onChange={setDorkState} />
          </div>
        </div>
      </section>

      {/* ── Presets library ── */}
      <section id="presets" className="py-12 border-t border-edge">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-amber-brand" />
            <h2 className="text-2xl font-bold tracking-tight">Bibliothèque de Dorks</h2>
          </div>
          <p className="text-dim text-sm mb-8">
            Cliquez sur un dork pour le charger automatiquement dans le générateur ci-dessus.
          </p>
          <DorkPresets onSelect={handlePresetSelect} />
        </div>
      </section>
    </div>
  )
}
