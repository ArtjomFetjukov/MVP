# Inventory MVP with PocketBase

This version uses **PocketBase** instead of local arrays, so devices and users are loaded from the database.

## Tech stack
- Node.js
- Express
- PocketBase
- HTML/CSS/JavaScript

## Install
```bash
npm install
```

## Run PocketBase
```bash
pocketbase serve
```

## Configure app
Copy `.env.example` to `.env` if needed:
```env
PORT=3000
POCKETBASE_URL=http://127.0.0.1:8090
```

## Start app
```bash
npm start
```

Open:
- App: http://localhost:3000
- PocketBase dashboard: http://127.0.0.1:8090/_/

## Required PocketBase collections
See `pocketbase-setup.md`.

## API routes
- `POST /api/login`
- `GET /api/devices`
- `POST /api/devices`
- `PUT /api/devices/:id`
- `DELETE /api/devices/:id`
- `GET /api/health`
