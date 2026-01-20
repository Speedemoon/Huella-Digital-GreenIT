const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const { pool } = require('./db');

dotenv.config();

const app = express();

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(compression());
app.use(express.json({ limit: '1mb' }));

const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: CORS_ORIGIN }));

// --- DB init (idempotente) ---
async function initDbIfPossible() {
  if (!pool) {
    console.log('API en modo SIN DB (memoria). Configura DATABASE_URL para Postgres.');
    return;
  }

  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('DB lista: schema aplicado/verificado');
  } catch (e) {
    console.error('No se pudo aplicar schema (continuo):', e.message);
  }
}

// --- In-memory fallback ---
const mem = [];

function ok(res, data) {
  res.json({ ok: true, ...data });
}

// Health
app.get('/api/health', async (req, res) => {
  if (!pool) return ok(res, { db: 'memory' });
  try {
    await pool.query('SELECT 1');
    ok(res, { db: 'up' });
  } catch (e) {
    res.status(500).json({ ok: false, db: 'down', error: e.message });
  }
});

// List
app.get('/api/calculations', async (req, res) => {
  if (!pool) {
    return ok(res, { items: [...mem].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || '')) });
  }

  try {
    const { rows } = await pool.query(
      'SELECT id, created_at, inputs, results FROM calculations ORDER BY created_at DESC LIMIT 500'
    );
    ok(res, { items: rows });
  } catch (e) {
    res.status(500).json({ ok: false, message: 'Failed to load calculations', error: e.message });
  }
});

// Create
app.post('/api/calculations', async (req, res) => {
  const { inputs, results } = req.body || {};

  if (!inputs || !results) {
    return res.status(400).json({ ok: false, message: 'inputs y results son requeridos' });
  }

  const id = (globalThis.crypto?.randomUUID?.() || require('crypto').randomUUID());

  if (!pool) {
    const item = { id, created_at: new Date().toISOString(), inputs, results };
    mem.unshift(item);
    return ok(res, { item });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO calculations (id, inputs, results) VALUES ($1, $2, $3) RETURNING id, created_at, inputs, results',
      [id, inputs, results]
    );
    ok(res, { item: rows[0] });
  } catch (e) {
    res.status(500).json({ ok: false, message: 'Failed to save calculation', error: e.message });
  }
});

// Delete
app.delete('/api/calculations/:id', async (req, res) => {
  const { id } = req.params;

  if (!pool) {
    const idx = mem.findIndex(x => x.id === id);
    if (idx === -1) return res.status(404).json({ ok: false, message: 'Not found' });
    mem.splice(idx, 1);
    return ok(res, {});
  }

  try {
    const result = await pool.query('DELETE FROM calculations WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ ok: false, message: 'Not found' });
    ok(res, {});
  } catch (e) {
    res.status(500).json({ ok: false, message: 'Failed to delete calculation', error: e.message });
  }
});

// Static (Angular build)
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// SPA fallback (todo menos /api)
app.get(/^\/(?!api).*/, (req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  res.status(404).send('Frontend no construido aun. Corre: npm run build');
});

const PORT = process.env.PORT || 3000;

initDbIfPossible().finally(() => {
  app.listen(PORT, () => {
    console.log(`HuellaDigitalGreenIT API running on port ${PORT}`);
  });
});
