# Fuel Tracker MVP

Web application for tracking fuel fill-ups, analyzing consumption and costs.

## Tech Stack

- **Backend**: NestJS (TypeScript, Express)
- **Frontend**: React 18 + Vite
- **Database**: PostgreSQL 16
- **Auth**: passport-local + express-session
- **Deployment**: Docker Compose

## Prerequisites

- Node.js >= 18
- Docker & Docker Compose
- WSL2 (for Windows development)

## Quick Start

```bash
# Clone repository
git clone <repository-url>
cd fuel-tracker

# Install dependencies
npm install

# Start Docker services (PostgreSQL)
npm run docker:up

# Run database migrations
npm run backend:migrate

# Start development servers
npm run dev
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Project Structure

```
fuel-tracker/
├── packages/
│   ├── backend/          # NestJS API
│   └── frontend/         # React + Vite
├── docker-compose.yml
├── package.json          # Root workspace
└── README.md
```

## Development

```bash
# Backend only
npm run backend:dev

# Frontend only
npm run frontend:dev

# Both concurrently
npm run dev
```

## Docker Commands

```bash
# Start services
npm run docker:up

# Stop services
npm run docker:down

# View logs
npm run docker:logs
```

## Build for Production

```bash
npm run build
```

## Environment Variables

Create `.env` file in backend package:

```env
DATABASE_URL=postgresql://fueluser:fuelpass@localhost:5432/fueltracker
SESSION_SECRET=your-secret-key
PORT=3000
```

## Testing

```bash
# Backend tests
npm run test --workspace=backend

# Frontend tests
npm run test --workspace=frontend
```

## License

MIT
