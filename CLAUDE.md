# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Dashboard de pilotage scolaire pour le Centre de services scolaire des Premières-Seigneuries (CSSPS, code 734000), alimenté par les données ouvertes du MEQ (Ministère de l'Éducation du Québec). Déployé sur Netlify.

## Commands

- `npm run dev` — start dev server (Vite)
- `npm run build` — production build (output: `dist/`)
- `npm run lint` — ESLint
- `npm run preview` — preview production build locally

## Stack

- React 19 + Vite 8 + Tailwind CSS 4 (via `@tailwindcss/vite` plugin)
- Recharts for data visualization
- No router — single-page app with tab-based navigation

## Architecture

- `src/App.jsx` — main component with all dashboard logic (KPIs, table, charts, tab navigation)
- `src/data_ecoles.json` — 92 CSSPS schools (location, coordinates, order of education)
- `src/data_defavorisation.json` — 50 schools with IMSE/SFR deprivation indices and student counts
- `data/` — raw CSV files from donneesquebec.ca and filtered JSON exports
- Tailwind is configured via `@import "tailwindcss"` in `src/index.css` (v4 style, no tailwind.config.js)

## Data

- Source: donneesquebec.ca, organization `mels` (MEQ-MES)
- CSSPS is filtered by `CD_CS=734000` (écoles publiques) or `Code_Cs=734000` (défavorisation)
- IMSE = Indice de milieu socioéconomique (1=favorisé, 10=défavorisé)
- SFR = Seuil de faible revenu
- School year: 2024-2025
