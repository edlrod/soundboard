# Soundboard

An open-source Last.fm / ListenBrainz viewer you can self-host and attach to your personal site. Show off your listening stats, top artists, albums, tracks, and recent scrobbles with a clean, opinionated interface.

Built with React, TypeScript, Vite, and Bun. Artist images powered by Deezer.

## Quick Start

```bash
git clone https://github.com/edlrod/soundboard.git
cd soundboard
bun install
```

Create a `.env` file:

```env
# For Last.fm (default)
VITE_LASTFM_API_KEY=your_api_key

# Or for ListenBrainz (no API key needed)
VITE_API_PROVIDER=listenbrainz
```

Then run it:

```bash
bun dev
```

## Providers

**Last.fm** (default) -- requires an API key. Rich user profiles with avatar, stats, and country.

**ListenBrainz** -- no API key needed. Set `VITE_API_PROVIDER=listenbrainz`. Album art via Cover Art Archive.

## Modes

**Explore mode** (default) -- leave `VITE_USERNAME` unset. Shows a search page where anyone can look up any user.

**Personal mode** -- set `VITE_USERNAME` to lock the app to a single profile. Ideal for embedding on your personal site.

## Configuration

| Variable | Required | Description |
|---|---|---|
| `VITE_API_PROVIDER` | No | `lastfm` (default) or `listenbrainz` |
| `VITE_LASTFM_API_KEY` | Last.fm only | [Get one here](https://www.last.fm/api/account/create) |
| `VITE_USERNAME` | No | Lock to a single profile. If unset, explore mode is enabled. |
| `VITE_DEFAULT_PERIOD` | No | Default time range. One of `7day`, `1month`, `3month`, `6month`, `12month`, `overall`. Defaults to `overall`. |
| `VITE_DEEZER_PROXY_URL` | Production only | URL of the Deezer CORS proxy. Not needed in dev (Vite handles it). See [Artist Images](#artist-images). |

> `VITE_LASTFM_USERNAME` is still supported as a fallback for backwards compatibility.

## Deploy

Build the static site and host it anywhere:

```bash
bun run build
```

Output goes to `dist/`. Deploy to Vercel, Netlify, Cloudflare Pages, or any static host.

### Artist Images

Artist images come from the Deezer API, which has CORS restrictions. In development, Vite's dev server proxies these requests automatically. For production, you need a CORS proxy.

A ready-to-deploy Cloudflare Worker is included in `/worker`:

```bash
cd worker
npx wrangler deploy
```

Then set the worker URL in your `.env`:

```env
VITE_DEEZER_PROXY_URL=https://soundboard-deezer-proxy.your-subdomain.workers.dev
```

Rebuild and deploy. The worker is free on Cloudflare's free tier (100K requests/day) and caches responses for 24 hours.

> Without `VITE_DEEZER_PROXY_URL`, artist images will gracefully fall back to letter placeholders in production.

## Development

```bash
bun dev          # start dev server
bun run build    # production build
bun lint         # check with biome
bun lint:fix     # auto-fix lint + format
bun format       # format only
```

## Stack

- [React](https://react.dev) + [TypeScript](https://typescriptlang.org)
- [Vite](https://vite.dev) + [Bun](https://bun.sh)
- [Tailwind CSS v4](https://tailwindcss.com)
- [TanStack Query](https://tanstack.com/query) for data fetching
- [Biome](https://biomejs.dev) for linting and formatting
- [Last.fm API](https://www.last.fm/api) for listening data
- [ListenBrainz API](https://listenbrainz.readthedocs.io) for listening data
- [Deezer API](https://developers.deezer.com) for artist images

## License

MIT &copy; [edlrod](https://github.com/edlrod)
