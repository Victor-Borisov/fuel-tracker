-- Complete initial migration for Fuel Tracker Database
-- This file recreates the entire database schema and includes sample data

-- Drop existing tables if they exist
DROP TABLE IF EXISTS fuel_entries CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS schema_migrations CASCADE;

-- Create schema_migrations table to track applied migrations
CREATE TABLE schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  preferred_currency VARCHAR(10) DEFAULT 'USD',
  preferred_distance_unit VARCHAR(10) DEFAULT 'mi',
  preferred_volume_unit VARCHAR(10) DEFAULT 'gal',
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  year INTEGER,
  fuel_type VARCHAR(50),
  license_plate VARCHAR(50),
  tank_capacity_liters DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on vehicles.user_id for faster queries
CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);

-- Create fuel_entries table
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
  currency VARCHAR(10) DEFAULT 'USD',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes on fuel_entries for faster queries
CREATE INDEX idx_fuel_entries_user_id ON fuel_entries(user_id);
CREATE INDEX idx_fuel_entries_vehicle_id ON fuel_entries(vehicle_id);
CREATE INDEX idx_fuel_entries_entry_date ON fuel_entries(entry_date);

-- Insert sample users
-- Password for all users: "password123"
INSERT INTO users (email, password_hash, display_name, preferred_currency, preferred_distance_unit, preferred_volume_unit, timezone) VALUES
('demo@fueltracker.com', '$2b$10$05Ax7tmFK/7HAZxq9KnB5O4SJ5GOjhzqRRakA3kVEa5DCGzyZqMQi', 'Demo User', 'USD', 'mi', 'gal', 'America/New_York');

-- Insert sample vehicles for demo user (id will be 1)
INSERT INTO vehicles (user_id, name, year, fuel_type, license_plate, tank_capacity_liters) VALUES
(1, 'Toyota Camry', 2020, 'Gasoline', 'ABC-123', 60.00),
(1, 'Honda Civic', 2021, 'Gasoline', 'XYZ-789', 50.00);

-- Insert sample fuel entries for Toyota Camry (vehicle_id will be 1)
INSERT INTO fuel_entries (user_id, vehicle_id, entry_date, odometer, station_name, fuel_brand, fuel_grade, quantity_liters, total_amount, currency, notes) VALUES
(1, 1, '2025-10-10', 15035, 'Airport Station', 'Mobil', 'Premium 93', 42.04, 62.44, 'USD', 'Full tank'),
(1, 1, '2025-09-27', 15459, 'Downtown Gas', 'Shell', 'Mid-Grade 89', 34.09, 54.19, 'USD', NULL),
(1, 1, '2025-09-19', 15880, 'Downtown Gas', 'Shell', 'Premium 93', 33.32, 47.50, 'USD', NULL),
(1, 1, '2025-09-11', 16236, 'Downtown Gas', 'Mobil', 'Premium 91', 48.42, 59.67, 'USD', 'Full tank'),
(1, 1, '2025-08-28', 16655, 'Highway 101 Stop', 'Mobil', 'Mid-Grade 89', 37.44, 48.25, 'USD', NULL),
(1, 1, '2025-08-22', 17033, 'Highway 101 Stop', 'BP', 'Regular 87', 51.13, 78.53, 'USD', NULL),
(1, 1, '2025-08-12', 17438, 'Main Street Station', 'Shell', 'Mid-Grade 89', 51.19, 63.39, 'USD', 'Full tank'),
(1, 1, '2025-07-30', 17890, 'Airport Station', 'Exxon', 'Premium 93', 44.58, 62.32, 'USD', NULL),
(1, 1, '2025-07-19', 18280, 'Downtown Gas', 'Chevron', 'Regular 87', 36.21, 51.63, 'USD', NULL),
(1, 1, '2025-07-11', 18656, 'Downtown Gas', 'Chevron', 'Regular 87', 35.65, 47.74, 'USD', 'Full tank'),
(1, 1, '2025-06-29', 19094, 'Airport Station', 'Shell', 'Premium 93', 33.44, 45.06, 'USD', NULL),
(1, 1, '2025-06-21', 19419, 'Main Street Station', 'BP', 'Regular 87', 30.33, 39.03, 'USD', NULL),
(1, 1, '2025-06-09', 19827, 'Downtown Gas', 'Exxon', 'Mid-Grade 89', 53.70, 84.91, 'USD', 'Full tank'),
(1, 1, '2025-05-30', 20218, 'Airport Station', 'Chevron', 'Premium 93', 37.32, 54.34, 'USD', NULL),
(1, 1, '2025-05-24', 20644, 'Highway 101 Stop', 'Chevron', 'Premium 91', 46.12, 73.43, 'USD', NULL),
(1, 1, '2025-05-11', 21075, 'Downtown Gas', 'Mobil', 'Premium 91', 37.14, 57.24, 'USD', 'Full tank'),
(1, 1, '2025-05-03', 21419, 'Airport Station', 'Exxon', 'Regular 87', 30.32, 42.69, 'USD', NULL),
(1, 1, '2025-04-20', 21852, 'Highway 101 Stop', 'Shell', 'Premium 93', 44.87, 65.50, 'USD', NULL),
(1, 1, '2025-04-12', 22241, 'Airport Station', 'Mobil', 'Mid-Grade 89', 53.10, 80.80, 'USD', 'Full tank'),
(1, 1, '2025-04-04', 22658, 'Main Street Station', 'Shell', 'Mid-Grade 89', 49.40, 77.39, 'USD', NULL);

-- Insert sample fuel entries for Honda Civic (vehicle_id will be 2)
INSERT INTO fuel_entries (user_id, vehicle_id, entry_date, odometer, station_name, fuel_brand, fuel_grade, quantity_liters, total_amount, currency, notes) VALUES
(1, 2, '2025-10-06', 8022, 'Main Street Station', 'BP', 'Premium 91', 25.69, 32.25, 'USD', 'Highway trip'),
(1, 2, '2025-09-29', 8429, 'Highway 101 Stop', 'Shell', 'Premium 91', 39.57, 47.67, 'USD', NULL),
(1, 2, '2025-09-16', 8774, 'Main Street Station', 'BP', 'Regular 87', 34.29, 39.87, 'USD', NULL),
(1, 2, '2025-08-30', 9098, 'Highway 101 Stop', 'Mobil', 'Regular 87', 26.90, 39.22, 'USD', NULL),
(1, 2, '2025-08-22', 9412, 'Main Street Station', 'BP', 'Premium 91', 42.10, 50.07, 'USD', 'Highway trip'),
(1, 2, '2025-08-11', 9768, 'Highway 101 Stop', 'Mobil', 'Regular 87', 25.44, 33.31, 'USD', NULL),
(1, 2, '2025-07-27', 10105, 'Main Street Station', 'Mobil', 'Regular 87', 27.02, 36.52, 'USD', NULL),
(1, 2, '2025-07-13', 10477, 'Highway 101 Stop', 'BP', 'Premium 91', 40.72, 48.68, 'USD', NULL),
(1, 2, '2025-07-05', 10820, 'Highway 101 Stop', 'Mobil', 'Regular 87', 28.46, 40.69, 'USD', 'Highway trip'),
(1, 2, '2025-06-23', 11168, 'Main Street Station', 'Shell', 'Premium 91', 42.48, 63.54, 'USD', NULL),
(1, 2, '2025-06-08', 11544, 'Main Street Station', 'Mobil', 'Premium 91', 36.48, 53.97, 'USD', NULL),
(1, 2, '2025-05-29', 11863, 'Main Street Station', 'BP', 'Premium 91', 26.29, 34.98, 'USD', NULL),
(1, 2, '2025-05-15', 12215, 'Main Street Station', 'Shell', 'Regular 87', 33.43, 46.91, 'USD', 'Highway trip'),
(1, 2, '2025-05-08', 12554, 'Main Street Station', 'BP', 'Regular 87', 30.19, 35.97, 'USD', NULL),
(1, 2, '2025-04-24', 12975, 'Highway 101 Stop', 'BP', 'Regular 87', 33.85, 41.39, 'USD', NULL);

-- Summary of sample data:
-- 1 demo user (demo@fueltracker.com / password123)
-- 2 vehicles (Toyota Camry 2020, Honda Civic 2021)
-- 35 fuel entries total (20 for Camry, 15 for Civic)
-- Entries span from April 2025 to October 2025

-- Mark this migration as applied
INSERT INTO schema_migrations (version) VALUES ('000_complete_init');
