import pg from "pg";
import { config } from "./database.js";

const { Pool } = pg;

export const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  max: 20, // Maximum connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

export const testConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connection test successful:", result.rows[0].now);
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error.message);
    return false;
  }
};
