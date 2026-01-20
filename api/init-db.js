const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

async function main() {
  if (!pool) {
    console.log('DATABASE_URL no está configurada. Omitiendo init de DB.');
    process.exit(0);
  }

  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('OK: schema aplicado');
  await pool.end();
}

main().catch(err => {
  console.error('Error aplicando schema:', err);
  process.exit(1);
});
