import { useState } from 'react'
import { Shield, LogIn, FolderOpen, Camera, FileText } from 'lucide-react'
import DorkCard, { type DorkPreset } from './DorkCard'
import { type DorkState } from './DorkBuilder'

const CATEGORIES = [
  { id: 'sensitive', label: 'Fichiers sensibles', Icon: Shield },
  { id: 'login', label: 'Pages de login', Icon: LogIn },
  { id: 'directory', label: 'Répertoires ouverts', Icon: FolderOpen },
  { id: 'iot', label: 'Caméras / IoT', Icon: Camera },
  { id: 'documents', label: 'Documents confidentiels', Icon: FileText },
]

const PRESETS: DorkPreset[] = [
  /* ── Fichiers sensibles ── */
  {
    id: 'env-db',
    title: 'Fichiers .env avec mot de passe BD',
    description: "Recherche des fichiers d'environnement exposés contenant des identifiants de base de données.",
    category: 'sensitive',
    state: { filetype: 'env', intext: 'DB_PASSWORD' },
  },
  {
    id: 'log-passwords',
    title: 'Logs contenant des mots de passe',
    description: 'Fichiers de logs exposés sur le web avec des références à des mots de passe.',
    category: 'sensitive',
    state: { filetype: 'log', intext: 'password' },
  },
  {
    id: 'sql-dumps',
    title: 'Dumps de bases de données',
    description: "Fichiers SQL exportés contenant des données d'insertion (INSERT INTO).",
    category: 'sensitive',
    state: { filetype: 'sql', query: '"INSERT INTO"' },
  },
  {
    id: 'config-passwords',
    title: 'Fichiers de configuration exposés',
    description: 'Fichiers de configuration avec des mots de passe en clair.',
    category: 'sensitive',
    state: { ext: 'cfg', intext: 'password' },
  },
  {
    id: 'env-secret',
    title: 'Secrets API exposés',
    description: 'Fichiers de configuration contenant des clés secrètes ou tokens API.',
    category: 'sensitive',
    state: { filetype: 'env', intext: 'SECRET_KEY' },
  },

  /* ── Pages de login ── */
  {
    id: 'admin-panel',
    title: "Panneaux d'administration",
    description: "Pages de connexion d'administration accessibles publiquement.",
    category: 'login',
    state: { intitle: 'admin login', inurl: 'admin' },
  },
  {
    id: 'wordpress-admin',
    title: 'Panneaux WordPress',
    description: 'Pages wp-admin de sites WordPress accessibles.',
    category: 'login',
    state: { inurl: '/wp-admin' },
  },
  {
    id: 'phpmyadmin',
    title: 'Interfaces phpMyAdmin',
    description: "Interfaces de gestion de base de données phpMyAdmin exposées.",
    category: 'login',
    state: { intitle: 'phpMyAdmin', inurl: 'phpmyadmin' },
  },
  {
    id: 'generic-login',
    title: 'Pages de login admin génériques',
    description: "Pages d'authentification administrative sans protection.",
    category: 'login',
    state: { inurl: '/admin/login' },
  },

  /* ── Répertoires ouverts ── */
  {
    id: 'open-dirs',
    title: 'Répertoires ouverts',
    description: 'Serveurs web avec le listing de répertoires activé — accès direct aux fichiers.',
    category: 'directory',
    state: { intitle: 'Index of /' },
  },
  {
    id: 'backup-dirs',
    title: 'Répertoires de sauvegarde',
    description: 'Répertoires contenant des fichiers de sauvegarde exposés.',
    category: 'directory',
    state: { intitle: 'Index of', query: 'backup' },
  },
  {
    id: 'parent-dir',
    title: 'Navigation parent directory',
    description: 'Répertoires avec navigation vers le dossier parent activée.',
    category: 'directory',
    state: { intitle: 'Index of /', query: '"parent directory"' },
  },

  /* ── Caméras / IoT ── */
  {
    id: 'webcamxp',
    title: 'Caméras WebcamXP',
    description: 'Flux vidéo de caméras WebcamXP accessibles depuis Internet.',
    category: 'iot',
    state: { intitle: 'webcamXP 5', inurl: '8080' },
  },
  {
    id: 'ip-cameras',
    title: 'Caméras IP exposées',
    description: "Interfaces de caméras IP accessibles sans authentification.",
    category: 'iot',
    state: { inurl: '/view/index.shtml' },
  },
  {
    id: 'axis-cameras',
    title: 'Caméras AXIS',
    description: 'Flux live de caméras de surveillance AXIS accessibles.',
    category: 'iot',
    state: { intitle: 'Live View / - AXIS' },
  },
  {
    id: 'network-cameras',
    title: 'Caméras réseau',
    description: 'Interfaces web de caméras réseau exposées sur le port 8080.',
    category: 'iot',
    state: { intitle: 'Network Camera', inurl: '8080' },
  },

  /* ── Documents confidentiels ── */
  {
    id: 'confidential-pdf',
    title: 'PDFs confidentiels',
    description: 'Documents PDF marqués comme confidentiels et non destinés à la distribution.',
    category: 'documents',
    state: { filetype: 'pdf', query: '"confidential" "do not distribute"' },
  },
  {
    id: 'internal-docs',
    title: 'Documents à usage interne',
    description: 'Documents Word destinés uniquement à un usage interne.',
    category: 'documents',
    state: { filetype: 'docx', intext: 'internal use only' },
  },
  {
    id: 'salary-files',
    title: 'Fichiers de salaires',
    description: 'Feuilles de calcul Excel contenant des informations salariales.',
    category: 'documents',
    state: { filetype: 'xlsx', intext: 'salary' },
  },
  {
    id: 'confidential-ppt',
    title: 'Présentations confidentielles',
    description: 'Fichiers PowerPoint marqués comme confidentiels.',
    category: 'documents',
    state: { filetype: 'ppt', query: '"confidential"' },
  },
]

interface Props {
  onSelect: (state: Partial<DorkState>) => void
}

export default function DorkPresets({ onSelect }: Props) {
  const [activeCategory, setActiveCategory] = useState('sensitive')

  const filtered = PRESETS.filter((p) => p.category === activeCategory)

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeCategory === id
                ? 'bg-amber-brand text-bg-dark shadow-[0_2px_12px_rgba(245,158,11,0.3)]'
                : 'bg-bg-card border border-edge text-dim hover:text-cream hover:border-edge-hover'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((preset) => (
          <DorkCard key={preset.id} preset={preset} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}
