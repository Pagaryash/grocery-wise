const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function validateData() {
  try {
    // Total count
    const countRes = await pool.query("SELECT COUNT(*) FROM items");
    console.log(`Total items: ${countRes.rows[0].count}`);

    // Duplicate item_id
    const dupRes = await pool.query(`
      SELECT item_id, COUNT(*)
      FROM items
      GROUP BY item_id
      HAVING COUNT(*) > 1
    `);
    console.log(`Duplicate item_ids: ${dupRes.rows.length}`);

    // Invalid item_id format (1-2 letters, 3-4 digits)
    const idRes = await pool.query(`
      SELECT item_id
      FROM items
      WHERE item_id !~ '^[A-Z]{1,2}[0-9]{3,4}$'
    `);
    console.log(`Invalid item_ids: ${idRes.rows.length}`);
    if (idRes.rows.length > 0) {
      console.log("Invalid item_ids:", idRes.rows);
    }

    // Missing name
    const nameRes = await pool.query(`
      SELECT item_id, name
      FROM items
      WHERE name IS NULL OR name = ''
    `);
    console.log(`Missing names: ${nameRes.rows.length}`);

    // Missing category
    const catRes = await pool.query(`
      SELECT item_id, name, category
      FROM items
      WHERE category IS NULL OR category = ''
    `);
    console.log(`Missing categories: ${catRes.rows.length}`);

    // Missing prices
    const priceRes = await pool.query(`
      SELECT item_id, name
      FROM items
      WHERE prices IS NULL
         OR NOT prices ? 'zepto'
         OR NOT prices ? 'swiggy_instamart'
         OR NOT prices ? 'blinkit'
         OR NOT prices ? 'jiomart'
    `);
    console.log(`Missing prices: ${priceRes.rows.length}`);

    // Invalid prices
    const invalidPriceRes = await pool.query(`
      SELECT item_id, name
      FROM items
      WHERE (prices->>'zepto')::DECIMAL <= 0
         OR (prices->>'swiggy_instamart')::DECIMAL <= 0
         OR (prices->>'blinkit')::DECIMAL <= 0
         OR (prices->>'jiomart')::DECIMAL <= 0
    `);
    console.log(`Invalid prices: ${invalidPriceRes.rows.length}`);

    // Missing availability
    const availRes = await pool.query(`
      SELECT item_id, name
      FROM items
      WHERE availability IS NULL
         OR NOT availability ? 'zepto'
         OR NOT availability ? 'swiggy_instamart'
         OR NOT availability ? 'blinkit'
         OR NOT availability ? 'jiomart'
    `);
    console.log(`Missing availabilities: ${availRes.rows.length}`);
  } catch (err) {
    console.error("Validation error:", err.stack);
  } finally {
    await pool.end();
  }
}

validateData();
