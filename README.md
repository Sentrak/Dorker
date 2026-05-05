# Dorker

> OSINT Google Dork Generator — generate 700+ targeted search queries for any domain.

Dorker is a free, open-source reconnaissance tool that lets security professionals and bug bounty hunters instantly generate Google Dork queries across 13 categories: subdomains, exposed files, secrets, admin panels, APIs, error pages, and more.

---

## Features

- **700+ dorks** organized across 13 attack-surface categories
- **Domain substitution** — all queries auto-fill with your target domain
- **Copy & Open** — copy any dork or open it directly in Google
- **Bulk export** — copy all dorks or download a `.txt` file per domain
- **i18n** — English / Français
- **Fully client-side** — no data is sent anywhere

---

## Tech Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Backend   | AdonisJS 6 (Node.js, TypeScript ESM)        |
| Frontend  | React 19 + Inertia.js (SSR/CSR hybrid)      |
| Build     | Vite 7 + TailwindCSS 4                      |
| i18n      | Custom system (`inertia/i18n/`)             |

---

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env and set APP_KEY (generate with: node ace generate:key)

# Run migrations
node ace migration:run

# Start dev server (HMR enabled)
node ace serve --hmr
```

Open [http://localhost:3333](http://localhost:3333).

---

## Build for Production

```bash
node ace build
cd build
npm ci --omit=dev
node server.js
```

---

## Categories

| # | Category | Description |
|---|----------|-------------|
| 1 | Subdomain Enum | Discover subdomains and virtual hosts |
| 2 | Directory / File | Open directory listings and exposed files |
| 3 | Secrets & Configs | `.env`, API keys, credentials, private keys |
| 4 | Admin Panels | Login pages, dashboards, management UIs |
| 5 | Vulnerable Files | `phpinfo`, git repos, error dumps |
| 6 | APIs & Swagger | REST endpoints, GraphQL, API docs |
| 7 | Error & Debug | SQL errors, stack traces, debug output |
| 8 | Documents | PDFs, spreadsheets, internal documents |
| 9 | Leaks | GitHub, Pastebin, GitLab, Bitbucket leaks |
| 10 | Takeover | Subdomain takeover candidates |
| 11 | Cloud | S3, GCS, Azure Blob, DigitalOcean Spaces |
| 12 | Dev / Test | Staging, dev, sandbox, QA environments |
| 13 | Social | LinkedIn, Twitter/X, employee OSINT |

---

## Legal Notice

Google Dorking is only legal on systems for which you have **explicit written authorization**, or for searching publicly available information. Unauthorized access to computer systems is a criminal offense in most jurisdictions.

This tool is for **educational purposes and authorized security testing only**.

---

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/Sentrak/Dorker).

---

## License

MIT — © 2025 [Sentrak](https://github.com/Sentrak)
