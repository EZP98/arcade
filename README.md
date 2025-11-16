# ALF Portfolio - Adele Lo Feudo

Portfolio artistico con backoffice CMS integrato, alimentato da Cloudflare Workers, D1 e R2.

## Tech Stack

### Frontend
- **React 19.1.0** con TypeScript
- **Vite 7.2.2** (build tool)
- **Tailwind CSS 3.4.18** (styling)
- **GSAP 3.13.0** (animazioni)
- **React Router** (routing)

### Backend
- **Cloudflare Workers** (API serverless)
- **Cloudflare D1** (database SQLite serverless)
- **Cloudflare R2** (object storage per immagini)

## Setup Locale

### 1. Installa le dipendenze

```bash
npm install
```

### 2. Configura Cloudflare

Assicurati di aver effettuato il login:

```bash
wrangler login
```

### 3. Database D1

Il database è già stato creato e popolato. Per eseguire query:

```bash
# Query sul database locale
wrangler d1 execute alf-portfolio-db --command="SELECT * FROM sections"

# Query sul database remoto
wrangler d1 execute alf-portfolio-db --remote --command="SELECT * FROM sections"
```

Per modificare lo schema:

```bash
# Locale
wrangler d1 execute alf-portfolio-db --file=schema.sql

# Remoto
wrangler d1 execute alf-portfolio-db --remote --file=schema.sql
```

### 4. R2 Storage (Immagini)

**IMPORTANTE**: Prima di usare R2, devi abilitarlo nel Dashboard di Cloudflare:

1. Vai su https://dash.cloudflare.com
2. Seleziona il tuo account
3. Nel menu laterale, cerca "R2 Object Storage"
4. Clicca su "Enable R2" o "Purchase R2"
5. Accetta i termini (piano gratuito: 10 GB storage, 1M operazioni lettura/mese)

Dopo aver abilitato R2, crea il bucket:

```bash
wrangler r2 bucket create alf-artworks
```

Poi aggiorna `wrangler.toml` decommentando la sezione R2:

```toml
[[r2_buckets]]
binding = "ARTWORKS"
bucket_name = "alf-artworks"
```

### 5. Avvia il Worker API

In una finestra del terminale:

```bash
wrangler dev
```

Il Worker sarà disponibile su `http://localhost:8787`

### 6. Avvia il frontend

In un'altra finestra del terminale:

```bash
npm run dev
```

Il frontend sarà disponibile su `http://localhost:5173`

## API Endpoints

### Opere (Artworks)

- `GET /api/artworks` - Lista tutte le opere
- `GET /api/artworks?section_id=1` - Opere di una sezione
- `GET /api/artworks/:id` - Singola opera
- `POST /api/artworks` - Crea nuova opera
- `PUT /api/artworks/:id` - Aggiorna opera
- `DELETE /api/artworks/:id` - Elimina opera

### Sezioni (Sections)

- `GET /api/sections` - Lista tutte le sezioni
- `GET /api/sections/:id` - Singola sezione
- `GET /api/sections/:id/artworks` - Opere di una sezione
- `POST /api/sections` - Crea nuova sezione
- `PUT /api/sections/:id` - Aggiorna sezione
- `DELETE /api/sections/:id` - Elimina sezione

### Content Blocks

- `GET /api/content` - Lista tutti i content blocks
- `GET /api/content/:key` - Singolo content block
- `PUT /api/content/:key` - Aggiorna content block

### Upload Immagini

- `POST /api/upload` - Upload immagine su R2 (richiede R2 abilitato)
- `GET /images/:filename` - Serve immagine da R2

## Deploy in Produzione

### 1. Deploy del Worker

```bash
wrangler deploy
```

Il Worker sarà disponibile su `https://alf-portfolio-api.<your-subdomain>.workers.dev`

### 2. Aggiorna l'URL dell'API

Crea un file `.env.production`:

```env
VITE_API_URL=https://alf-portfolio-api.<your-subdomain>.workers.dev
```

### 3. Build e deploy del frontend

```bash
npm run build
```

Poi puoi deployare la cartella `dist` su Cloudflare Pages, Vercel, Netlify, etc.

## Struttura del Database

### Tabella `sections`
- `id` - ID unico
- `name` - Nome della sezione (es: "Name series")
- `slug` - Slug URL-friendly
- `description` - Descrizione della sezione
- `order_index` - Ordine di visualizzazione
- `created_at`, `updated_at` - Timestamp

### Tabella `artworks`
- `id` - ID unico
- `title` - Titolo dell'opera
- `description` - Descrizione dell'opera
- `image_url` - URL dell'immagine
- `section_id` - ID della sezione di appartenenza
- `order_index` - Ordine nella sezione
- `created_at`, `updated_at` - Timestamp

### Tabella `content_blocks`
- `id` - ID unico
- `key` - Chiave univoca (es: "hero_title", "hero_subtitle")
- `title` - Titolo opzionale
- `content` - Contenuto testuale
- `image_url` - URL immagine opzionale
- `updated_at` - Timestamp

## Backoffice

Accedi al backoffice su `http://localhost:5173/content`

### Funzionalità:
- ✅ Visualizza lista opere
- ✅ Modifica opere esistenti
- ✅ Elimina opere
- ✅ Aggiungi nuove opere (form)
- ⏳ Upload immagini (richiede R2 abilitato)
- ⏳ Gestione sezioni

## Note

- Il database D1 è già stato popolato con dati di esempio
- Le immagini sono servite tramite R2 dopo l'abilitazione
- Le API supportano CORS per sviluppo locale
- Tutte le operazioni sono transazionali

## Troubleshooting

### Il Worker non si avvia
- Verifica di aver effettuato `wrangler login`
- Controlla che il `wrangler.toml` sia corretto

### Errore R2 "Please enable R2"
- Devi abilitare R2 manualmente nel Dashboard Cloudflare
- Segui le istruzioni nella sezione "R2 Storage"

### Errore CORS
- Assicurati che il Worker sia in esecuzione su `localhost:8787`
- Verifica che l'URL in `.env` sia corretto

### Dati non si caricano
- Controlla la console del browser per errori
- Verifica che il Worker sia in esecuzione
- Testa le API con `curl http://localhost:8787/api/artworks`
