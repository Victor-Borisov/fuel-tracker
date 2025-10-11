-- Migration 001: Initial Schema
-- Created: 2025-01-11

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  preferred_currency VARCHAR(3) DEFAULT 'USD',
  preferred_distance_unit VARCHAR(10) DEFAULT 'mi',
  preferred_volume_unit VARCHAR(10) DEFAULT 'gal',
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  make VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  fuel_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fuel_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  odometer INTEGER NOT NULL CHECK (odometer > 0),
  station_name VARCHAR(255) NOT NULL,
  fuel_brand VARCHAR(100) NOT NULL,
  fuel_grade VARCHAR(50) NOT NULL,
  quantity_liters DECIMAL(10, 2) NOT NULL CHECK (quantity_liters > 0),
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount > 0),
  currency VARCHAR(3) DEFAULT 'USD',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_fuel_entries_user_id ON fuel_entries(user_id);
CREATE INDEX idx_fuel_entries_vehicle_id ON fuel_entries(vehicle_id);
CREATE INDEX idx_fuel_entries_entry_date ON fuel_entries(entry_date);
CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fuel_entries_updated_at BEFORE UPDATE ON fuel_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
