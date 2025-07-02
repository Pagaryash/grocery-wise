const { Pool } = require("pg");
require("dotenv").config(); // Loads .env from current directory (/backend)

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Connected to PostgreSQL:", res.rows[0]);
  } catch (err) {
    console.error("Connection error:", err.message);
  } finally {
    await pool.end();
  }
}

testConnection();
