-- schema.sql: Database schema for GroceryWise

-- Items table
CREATE TABLE items (
  item_id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  prices JSONB NOT NULL,
  availability JSONB NOT NULL
);

-- Full-text search index on name
CREATE INDEX items_name_fts_idx ON items USING GIN (to_tsvector('english', name));

-- Index on category
CREATE INDEX items_category_idx ON items (category);

-- Carts table
CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  item_id VARCHAR(10) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  FOREIGN KEY (item_id) REFERENCES items(item_id)
);

-- Fees table
CREATE TABLE fees (
  platform VARCHAR(50) PRIMARY KEY,
  delivery_fee DECIMAL(10,2) NOT NULL,
  other_fee DECIMAL(10,2) DEFAULT 0.00
);

-- Sample fee data
INSERT INTO fees (platform, delivery_fee, other_fee) VALUES
  ('zepto', 20.00, 5.00),
  ('swiggy_instamart', 25.00, 3.00),
  ('blinkit', 15.00, 4.00),
  ('jiomart', 10.00, 2.00);