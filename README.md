# NestJS PostgreSQL CRUD API with Auth & RBAC

A full-featured REST API built with NestJS, PostgreSQL, and TypeORM. This project includes user registration, login, JWT authentication, and role-based access control, in addition to basic CRUD operations on cities.

## 🛠️ Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeORM** - Object-Relational Mapping
- **PostgreSQL** - Relational Database
- **TypeScript** - Type-safe JavaScript
- **Passport.js** - Middleware for authentication strategies (used with JWT)
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

## ✨ Features

- 🔐 **JWT Authentication** - Secure token-based auth
- 🛡️ **Role-Based Access Control** - Admin/User permissions
- 🔒 **Password Security** - bcrypt hashing
- 🚀 **RESTful API** - Standard HTTP methods
- 📊 **Database Integration** - PostgreSQL with TypeORM
- 🎯 **Type Safety** - Full TypeScript support
- 🧪 **Easy Testing** - Ready for Postman/curl

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/saadamir1/nestjs-pg-crud.git
cd nestjs-pg-crud
npm install
```

### 2. Database Setup

Make sure PostgreSQL is running. Then:

```sql
CREATE USER dev WITH PASSWORD 'secret';
CREATE DATABASE demo OWNER dev;
GRANT ALL PRIVILEGES ON DATABASE demo TO dev;
```

### 3. Environment Variables

Create a `.env` file at the root:

```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=dev
DB_PASSWORD=secret
DB_NAME=demo
JWT_SECRET=jwt-secret-key
JWT_EXPIRES_IN=3600s
```

### 4. Run Application

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## 🧪 API Endpoints

### 🔐 Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register user |
| `POST` | `/auth/login` | Login user and receive JWT |
| `GET` | `/auth/me` | Get current logged-in user (JWT required) |

### 👤 Users (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | Get all users (admin only) |
| `GET` | `/users/profile` | Get user profile (JWT required) |

### 🌍 Cities (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/cities` | Create a city |
| `GET` | `/cities` | Get all cities |
| `GET` | `/cities/:id` | Get city by ID |
| `PATCH` | `/cities/:id` | Update city |
| `DELETE` | `/cities/:id` | Delete city |

## 🧪 Testing the API

### Register a User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin"
  }'
```

### Login & Get Token
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securePassword123"
  }'
```

### Use Token for Protected Routes
```bash
# Get current user profile
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# Create a city (protected)
curl -X POST http://localhost:3000/cities \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name": "New York", "description": "The Big Apple"}'
```

## 📄 Database Schema

### User Schema
```json
{
  "id": "number (auto-generated)",
  "email": "string (unique, required)",
  "password": "string (hashed)",
  "firstName": "string (required)",
  "lastName": "string (required)",
  "role": "string (admin | user)"
}
```

### City Schema
```json
{
  "id": "number (auto-generated)",
  "name": "string (unique, required)",
  "description": "string (optional)",
  "active": "boolean (default: true)"
}
```

## 🔐 Authentication & Authorization

- **JWT** is issued at login and must be included in `Authorization: Bearer <token>` for protected routes
- **Role-Based Access Control (RBAC)** is implemented using custom decorators and guards
- Example: Only `admin` role can access `/users` endpoint
- Passwords are hashed using bcrypt before storing in database

## 🗂️ Project Structure

```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── entities/user.entity.ts
├── cities/
│   ├── cities.controller.ts
│   ├── cities.service.ts
│   └── entities/city.entity.ts
├── common/
│   ├── decorators/roles.decorator.ts
│   └── guards/roles.guard.ts
├── app.module.ts
└── main.ts
```

## 📜 Available Scripts

```bash
# Development
npm run start:dev    # Start in watch mode
npm run start:debug  # Start in debug mode

# Production  
npm run build        # Build the app
npm run start:prod   # Start production server

# Testing
npm run test         # Run unit tests
npm run test:e2e     # Run e2e tests
npm run test:cov     # Test coverage
```

## 🔧 Troubleshooting

### Common Issues

**Database Connection Error:**
```bash
# Make sure PostgreSQL is running
sudo service postgresql start

# Check if user exists
psql -U postgres -c "\du"
```

**JWT Token Issues:**
- Ensure `JWT_SECRET` is set in `.env`
- Check token format: `Authorization: Bearer <token>`
- Verify token hasn't expired (default: 1 hour)

**Permission Denied:**
- Check user role in database
- Ensure you're using correct endpoint permissions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Happy Coding! 🚀**

### Tags
`nestjs` `typeorm` `postgresql` `jwt-auth` `rbac` `crud-api` `backend` `authentication` `authorization` `typescript`
