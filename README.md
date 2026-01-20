# Huella Digital GreenIT (Angular + Express + Postgres)

Tema: **verde oscuro**, estilo **C (Landing + App)**.

## Estructura
- `web/` Angular (UI moderna)
- `api/` Express (API) + Postgres (Railway)

## Local (recomendado)
1) DB (opcional)

- Si **ya** tienes Postgres (local o Railway), copia `api/.env.example` a `api/.env` y pon tu `DATABASE_URL`.
- Si **no** tienes DB aún, no pasa nada: el API usa un **almacenamiento en memoria** para que puedas probar la app.

2) Instala y corre

### Terminal 1 (API)
```bash
cd api
npm install
npm run start
```

### Terminal 2 (WEB)
```bash
cd web
npm install
npm start
```

✅ Nota: en dev, el **proxy** ya viene configurado en `web/proxy.conf.json`, así que `/api` se redirige a `http://localhost:3000` cuando corres `npm start` en `web`.

## Deploy en Railway (igual que AutoTyre)
- **Build Command:** `npm run build`
- **Start Command:** `npm start`

### Variables
- Conecta el plugin **Postgres** al servicio.
- Asegúrate de tener `DATABASE_URL` en Variables del servicio (Railway normalmente lo agrega cuando conectas el plugin).

## Notas
- El backend sirve el Angular compilado desde `api/public`.
- Para compilar y copiar frontend:
```bash
npm run build
```
