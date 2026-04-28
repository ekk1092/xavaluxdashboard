# Xavalux Dashboard

Xavalux Dashboard is a Vite + React inventory and order management frontend.

## Requirements

- Node.js 20+
- npm 10+

## Quick Start

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173` by default.

## Environment Variables

Copy `.env.example` to `.env` and set values as needed.

- `VITE_GEMINI_API_KEY`: Gemini API key used by client-side AI actions.

## Quality Gates

```bash
npm run lint
npm run test:ci
npm run build
```

Run all production checks in one command:

```bash
npm run check
```

## Production Build

```bash
npm run build
npm run preview
```

The built output is generated in `dist/`.

## Deployment Guide

See [DEPLOYMENT.md](DEPLOYMENT.md) for a step-by-step deployment guide.