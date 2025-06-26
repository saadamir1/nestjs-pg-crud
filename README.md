# NestJS PostgreSQL CRUD API

A simple REST API built with [NestJS](https://nestjs.com/), PostgreSQL, and TypeORM for managing cities with basic CRUD operations.

## 🛠️ Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeORM** - Object-Relational Mapping
- **PostgreSQL** - Database
- **TypeScript** - Language

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/saadamir1/nestjs-pg-crud.git
cd nestjs-pg-crud
npm install
```

### 2. Database Setup
Make sure PostgreSQL is running on your system. Create a user and database:
```sql
CREATE USER dev WITH PASSWORD 'secret';
CREATE DATABASE demo OWNER dev;
```

### 3. Environment Variables
Create `.env` file:
```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=dev
DB_PASSWORD=secret
DB_NAME=demo
```

### 4. Run Application
```bash
npm run start:dev
```

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/cities` | Create city |
| `GET` | `/cities` | Get all cities |
| `GET` | `/cities/:id` | Get city by ID |
| `PATCH` | `/cities/:id` | Update city |
| `DELETE` | `/cities/:id` | Delete city |

## 📄 City Schema

```json
{
  "id": "number (auto-generated)",
  "name": "string (unique, required)",
  "description": "string (optional)",
  "active": "boolean (default: true)"
}
```

## 🧪 Test with cURL

```bash
# Create city
curl -X POST http://localhost:3000/cities \
  -H "Content-Type: application/json" \
  -d '{"name": "New York", "description": "The Big Apple"}'

# Get all cities
curl http://localhost:3000/cities
```

## 📁 Project Structure

```
src/
├── cities/
│   ├── entities/city.entity.ts
│   ├── dto/
│   ├── cities.controller.ts
│   ├── cities.service.ts
│   └── cities.module.ts
├── app.module.ts
└── main.ts
```

---

Happy Coding!
