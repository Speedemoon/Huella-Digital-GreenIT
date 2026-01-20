const { Pool } = require('pg');

function createPool() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  // Railway suele requerir SSL. En local normalmente no.
  // - Si PGSSLMODE=disable => sin ssl
  // - Si DATABASE_URL incluye "sslmode=disable" => sin ssl
  const disableSsl =
    (process.env.PGSSLMODE || '').toLowerCase() === 'disable' ||
    /sslmode=disable/i.test(url);

  return new Pool({
    connectionString: url,
    ssl: disableSsl ? false : { rejectUnauthorized: false }
  });
}

const pool = createPool();

module.exports = { pool };
