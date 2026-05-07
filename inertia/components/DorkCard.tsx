import { ArrowRight } from 'lucide-react'
import { type DorkState, defaultDorkState, buildDorkQuery } from './DorkBuilder'
import DorkHighlight from './DorkHighlight'

export interface DorkPreset {
  id: string
  title: string
  description: string
  category: string
  state: Partial<DorkState>
}

interface Props {
  preset: DorkPreset
  onSelect: (state: Partial<DorkState>) => void
}

export default function DorkCard({ preset, onSelect }: Props) {
  const fullState = { ...defaultDorkState, ...preset.state }
  const dork = buildDorkQuery(fullState)

  return (
    <button
      onClick={() => onSelect(preset.state)}
      className="group w-full text-left bg-bg-card border border-edge hover:border-amber-brand/25 rounded-xl p-5 transition-all hover:bg-bg-card-hover hover:shadow-[0_4px_24px_rgba(0,0,0,0.25)] cursor-pointer"
    >
      <h4 className="font-semibold text-sm text-cream mb-1.5 group-hover:text-amber-brand transition-colors leading-snug">
        {preset.title}
      </h4>
      <p className="text-xs text-mute mb-3.5 leading-relaxed">{preset.description}</p>
      <div className="font-mono text-xs bg-bg-secondary rounded-lg px-3 py-2 truncate border border-edge/50 mb-3">
        <DorkHighlight dork={dork} style={{ opacity: 0.85 }} />
      </div>
      <div className="flex items-center gap-1 text-xs text-dim group-hover:text-amber-brand transition-colors">
        <span>Charger dans le générateur</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </button>
  )
}
