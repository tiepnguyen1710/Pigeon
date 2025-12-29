# Chat App

A full-stack real-time chat application.

## 📁 Project Structure

```
Chat-app/
├── ChatAppBe/      # Backend - NestJS
├── ChatAppFe/      # Frontend - (Coming soon)
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL (via Docker)

### Backend Setup

```bash
# Navigate to backend folder
cd ChatAppBe

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start PostgreSQL with Docker
docker-compose up -d

# Run Prisma migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

### Frontend Setup

```bash
# Navigate to frontend folder
cd ChatAppFe

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Container**: Docker

### Frontend
- Coming soon...

## 📝 License

This project is licensed under the MIT License.
