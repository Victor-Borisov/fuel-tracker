# Fuel Tracker

A web application for tracking fuel consumption, costs, and vehicle statistics.

## Features

- **User Authentication**: Secure sign up/sign in with session-based authentication
- **Vehicle Management**: Add, edit, and manage multiple vehicles
- **Fuel Entry Tracking**: Record fuel fill-ups with detailed information (station, brand, grade, cost, etc.)
- **Statistics & Analytics**:
  - Dashboard with consumption metrics and charts
  - Per-fill-up calculations (consumption, cost per km/mile)
  - Brand/grade comparison
  - Rolling averages
- **Unit Support**: Metric (L/100km) and Imperial (MPG) units
- **Data Export**: Export your data to CSV (GDPR compliance)
- **Account Management**: Update profile settings, delete account

## Tech Stack

### Backend
- NestJS 10+ (TypeScript)
- PostgreSQL 16
- Node-postgres (pg) - raw SQL queries
- Passport.js + express-session for authentication
- bcrypt for password hashing

### Frontend
- React 18 + TypeScript
- Vite 5
- React Router v6
- React Context API for state management
- Bootstrap 5 for UI

### Infrastructure
- Docker & Docker Compose
- nginx for frontend serving

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- Node.js 20+ (for local development)
- npm or pnpm

## Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd fuel-tracker
```

2. Start all services with Docker Compose:
```bash
docker-compose up -d
```

This will:
- Start PostgreSQL database
- Apply database migrations automatically
- Build and start the backend API
- Build and start the frontend application

3. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:3000
- API Documentation (Swagger): http://localhost:3000/api

4. Default demo account:
- Email: `demo@fueltracker.com`
- Password: `password123`

## Local Development

### Backend Development

```bash
cd packages/backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run in development mode (with hot reload)
npm run dev

# Run in production mode
npm run build
npm run start:prod
```

Backend will be available at http://localhost:3000

### Frontend Development

```bash
cd packages/frontend

# Install dependencies
npm install

# Run development server (with hot reload)
npm run dev

# Build for production
npm run build
```

Frontend will be available at http://localhost:5173

### Database Setup

PostgreSQL should be running (via Docker or locally).

To manually run migrations:
```bash
# Using psql
psql -U fueluser -d fueltracker -f packages/backend/migrations/000_complete_init.sql

# Using Node.js
cd packages/backend
node -e "const { Pool } = require('pg'); const fs = require('fs'); const pool = new Pool({ connectionString: 'postgresql://fueluser:fuelpass@localhost:5432/fueltracker' }); const sql = fs.readFileSync('./migrations/000_complete_init.sql', 'utf8'); pool.query(sql).then(() => { console.log('Migration applied'); pool.end(); }).catch(e => { console.error(e); pool.end(); });"
```

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://fueluser:fuelpass@localhost:5432/fueltracker
SESSION_SECRET=your-secret-key-change-in-production
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

## Project Structure

```
fuel-tracker/
├── docker-compose.yml           # Docker services configuration
├── README.md                    # This file
│
├── packages/
│   ├── backend/                 # NestJS backend
│   │   ├── src/
│   │   │   ├── main.ts         # Application entry point
│   │   │   ├── app.module.ts
│   │   │   ├── auth/           # Authentication module
│   │   │   ├── users/          # User management
│   │   │   ├── vehicles/       # Vehicle CRUD
│   │   │   ├── fuel-entries/   # Fuel entry CRUD
│   │   │   ├── statistics/     # Analytics & calculations
│   │   │   └── database/       # Database connection
│   │   ├── migrations/         # SQL migration files
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/                # React frontend
│       ├── src/
│       │   ├── main.tsx        # Application entry point
│       │   ├── App.tsx
│       │   ├── pages/          # Page components
│       │   ├── components/     # Reusable components
│       │   ├── contexts/       # React contexts
│       │   ├── api/            # API client
│       │   └── types/          # TypeScript types
│       ├── Dockerfile
│       ├── nginx.conf          # nginx configuration
│       ├── package.json
│       └── vite.config.ts
```

## API Documentation

When running the backend, Swagger documentation is available at:
http://localhost:3000/api

## Database Schema

### Users Table
- Authentication and profile information
- Preferences (currency, units, timezone)

### Vehicles Table
- Vehicle information (name, year, fuel type, etc.)
- Linked to users

### Fuel Entries Table
- Fill-up records with detailed information
- Linked to vehicles and users
- Includes consumption calculations

### Schema Migrations Table
- Tracks applied database migrations

## Testing

### Backend Tests

```bash
cd packages/backend
npm run test              # Unit tests
npm run test:e2e          # Integration tests
npm run test:cov          # Coverage report
```

### Frontend Tests

```bash
cd packages/frontend
npm run test
```

## Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start services
docker-compose up -d --build

# Remove all containers and volumes (clean start)
docker-compose down -v
```

## Production Deployment

1. Update environment variables in `.env` files
2. Set `SESSION_SECRET` to a strong random value
3. Set `NODE_ENV=production`
4. Configure proper domain names
5. Setup HTTPS/SSL certificates (recommended: Let's Encrypt)
6. Run with Docker Compose:

```bash
docker-compose up -d --build
```

## Security Considerations

- Passwords are hashed with bcrypt
- Sessions use HTTP-only, Secure cookies
- SQL injection protection via parameterized queries
- CORS configured for specific origins
- Data isolation: users can only access their own data
- GDPR compliance: hard delete on account deletion, data export

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
