# Aethermorrow

Forecast the magic ahead.

Aethermorrow is a whimsical, polished weather and trip-planning web app with a React frontend and an Express backend. It features a dynamic celestial interface, Celsius-first forecasts, world destination support, South Coast South Africa coastal entries like Ramsgate and Margate, weather-aware activity scoring, fishing recommendations, and a lightweight saved-plan vault.

## Stack

- Frontend: React + Vite
- Backend: Express
- Animations: Framer Motion
- Icons: Lucide React
- Charts: Recharts

## Highlights

- More creative and dynamic visual theme with animated aurora layers, constellation accents, and glassmorphism panels
- Global destination input with featured quick-pick cities
- Explicit South Africa coastal support including Ramsgate and Margate
- Celsius temperatures and km/h wind across the experience
- Fishing activities plus a "best fishing spots near you" module
- Trip planner with a two-week calendar and weather-dependent activity scoring
- Backend endpoints for forecasts, activities/metadata, fishing spots, and saved plans

## Project structure

```text
.
├── backend
│   ├── data
│   │   └── plans.json
│   ├── package.json
│   └── src
│       ├── routes
│       ├── services
│       └── server.js
├── frontend
│   ├── public
│   │   └── brand-mark.png
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── src
│       ├── api
│       ├── components
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
└── package.json
```

## Getting started

```bash
npm install
npm run dev
```

That starts:
- frontend: http://localhost:5173
- backend: http://localhost:8787

## Production

```bash
npm install
npm run build
npm run start
```

## API

- `GET /api/health`
- `GET /api/activities`
- `GET /api/forecast?destination=Ramsgate&startDate=2026-04-17&tone=balanced&selectedActivities=coastal-fishing,gallery`
- `GET /api/fishing-spots?destination=Ramsgate&precip=18&windSpeed=14&high=25`
- `GET /api/plans`
- `POST /api/plans`

## Notes

- Forecasts are deterministic mock forecasts so the app runs immediately without third-party APIs.
- The backend is structured so a real weather provider can be swapped in later.
- Footer line included as requested: **A quantum cupcake creation**.
