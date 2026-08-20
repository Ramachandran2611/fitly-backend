import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Without this, an idle client error (e.g. the DB closing an idle
// connection) is an unhandled 'error' event and crashes the process.
pool.on("error", (err) => {
  console.error("Unexpected error on idle Postgres client", err);
});
