import React from 'react'

interface Token {
  type: 'operator' | 'value' | 'query' | 'exclude'
  text: string
}

function tokenizeDork(dork: string): Token[] {
  const tokens: Token[] = []
  const parts = dork.match(/(?:[^\s"]+|"[^"]*")+/g) ?? []

  for (const part of parts) {
    if (part.startsWith('-')) {
      tokens.push({ type: 'exclude', text: part })
      continue
    }
    const colonIdx = part.indexOf(':')
    if (colonIdx > 0) {
      const op = part.slice(0, colonIdx + 1)
      const val = part.slice(colonIdx + 1)
      tokens.push({ type: 'operator', text: op })
      if (val) tokens.push({ type: 'value', text: val })
    } else {
      tokens.push({ type: 'query', text: part })
    }
  }
  return tokens
}

const COLORS = {
  operator: '#38bdf8', // cyan  – opérateurs (site:, filetype:…)
  value: '#34d399',    // vert  – valeurs après l'opérateur
  query: '#c4cfe0',    // gris clair – termes généraux
  exclude: '#fb7185',  // rose  – termes exclus (-terme)
  domain: '#f59e0b',   // amber – domaine saisi par l'utilisateur
}

function renderWithDomain(text: string, domain: string, baseColor: string) {
  if (!domain) return <span style={{ color: baseColor }}>{text}</span>

  const escaped = domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)
  const lowerDomain = domain.toLowerCase()

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === lowerDomain ? (
          <span key={i} style={{ color: COLORS.domain }}>{part}</span>
        ) : (
          part ? <span key={i} style={{ color: baseColor }}>{part}</span> : null
        )
      )}
    </>
  )
}

interface Props {
  dork: string
  domain?: string
  style?: React.CSSProperties
}

export default function DorkHighlight({ dork, domain = '', style }: Props) {
  const tokens = tokenizeDork(dork)

  return (
    <span style={style}>
      {tokens.map((token, i) => (
        <React.Fragment key={i}>
          {i > 0 && ' '}
          {token.type === 'operator' ? (
            <span style={{ color: COLORS.operator }}>{token.text}</span>
          ) : (
            renderWithDomain(token.text, domain, COLORS[token.type])
          )}
        </React.Fragment>
      ))}
    </span>
  )
}
