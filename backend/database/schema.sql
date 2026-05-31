-- Drop existing tables
DROP TABLE IF EXISTS transactions CASCADE;

DROP TABLE IF EXISTS items CASCADE;

DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items table
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  qr_code VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100),
  location VARCHAR(255),
  min_quantity INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  transaction_type VARCHAR(10) NOT NULL,
  quantity INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_items_qr_code ON items(qr_code);

CREATE INDEX idx_items_category ON items(category);

CREATE INDEX idx_items_status ON items(status);

CREATE INDEX idx_transactions_item_id ON transactions(item_id);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);

CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);