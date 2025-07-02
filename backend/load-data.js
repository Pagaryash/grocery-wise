const { Pool } = require("pg");
const fs = require("fs").promises;
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function loadData() {
  try {
    // Read JSON file
    const rawData = await fs.readFile("../scripts/grocery_prices.json", "utf8");
    const data = JSON.parse(rawData);

    // Insert items
    for (const item of data.items) {
      await pool.query(
        `INSERT INTO items (item_id, name, category, prices, availability)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (item_id) DO NOTHING`,
        [item.item_id, item.name, item.category, item.prices, item.availability]
      );
    }

    console.log("Data loaded successfully!");
    // Verify item count
    const res = await pool.query("SELECT COUNT(*) FROM items");
    console.log(`Inserted ${res.rows[0].count} items`);
  } catch (err) {
    console.error("Error loading data:", err.message);
  } finally {
    await pool.end();
  }
}

loadData();
