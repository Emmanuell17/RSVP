const { Pool } = require("pg");
const fs = require("fs/promises");
const path = require("path");

const connectionString = process.env.DATABASE_URL || "";

/** Hosted Postgres (Neon, Supabase, Railway, Render) usually needs TLS. Local often does not. */
function useSsl(cs) {
  if (process.env.DATABASE_SSL === "false") return false;
  if (process.env.DATABASE_SSL === "true") return true;
  /* Heroku Postgres requires TLS; DATABASE_URL often omits ?sslmode=require */
  if (process.env.DYNO) return true;
  return /(?:[?&]sslmode=require|[?&]ssl=true\b)/i.test(cs || "");
}

const pool = new Pool({
  connectionString: connectionString || undefined,
  ssl: useSsl(connectionString)
    ? { rejectUnauthorized: false }
    : undefined,
});

async function ensureSchema() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const schemaSql = await fs.readFile(schemaPath, "utf8");
  await pool.query(schemaSql);
}

module.exports = { pool, ensureSchema };
