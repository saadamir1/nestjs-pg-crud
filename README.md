# NestJS PostgreSQL CRUD API with Auth & RBAC

A full-featured REST API built with NestJS, PostgreSQL, and TypeORM with JWT authentication, refresh tokens, role-based access control, and CRUD operations.

## 🛠️ Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript
- **PostgreSQL** - Relational database
- **JWT** - Access and refresh token authentication
- **bcrypt** - Password hashing
- **TypeScript** - Type safety

## ✨ Features

- 🔐 **JWT Authentication** (Access + Refresh Tokens)
- 🔄 **Token Refresh Mechanism**
- 🛡️ **Role-Based Access Control** (Admin/User)
- 🔒 **Hashed Passwords with bcrypt**
- 📋 **Pagination Support** (e.g., `/cities?page=2`)
- 🧹 **Soft Delete Support** (e.g., cities)
- 🧾 **Request Logging Middleware**
- 🚀 **RESTful API Structure**
- 📊 **Database Integration** - PostgreSQL with TypeORM
- 🎯 **Type Safety** - Full TypeScript support
- 🧪 **Easy Testing** - Ready for Postman/curl

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/saadamir1/nestjs-pg-crud.git
cd nestjs-pg-crud
npm install
```

### 2. Database Setup

```sql
CREATE USER dev WITH PASSWORD 'secret';
CREATE DATABASE demo OWNER dev;
GRANT ALL PRIVILEGES ON DATABASE demo TO dev;
```

### 3. Environment Variables

Create `.env`:

```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=dev
DB_PASSWORD=secret
DB_NAME=demo
JWT_SECRET=jwt-secret-key
JWT_EXPIRES_IN=900s
JWT_REFRESH_SECRET=jwt-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
```

### 4. Run Application

```bash
npm run start:dev
```

API available at `http://localhost:3000`

## 🧪 API Endpoints

### 🔐 Auth

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| `POST` | `/auth/register` | Register user        |
| `POST` | `/auth/login`    | Login and get tokens |
| `POST` | `/auth/refresh`  | Refresh access token |
| `GET`  | `/auth/me`       | Get current user     |

### 👤 Users (Protected)

| Method | Endpoint         | Description                |
| ------ | ---------------- | -------------------------- |
| `GET`  | `/users`         | Get all users (admin only) |
| `GET`  | `/users/profile` | Get user profile           |
| `POST` | `/users`         | Create user (admin only)   |

### 🌍 Cities (Protected)

| Method   | Endpoint         | Description          |
| -------- | ---------------- | -------------------- |
| `POST`   | `/cities`        | Create city          |
| `GET`    | `/cities?page=1` | Get paginated cities |
| `GET`    | `/cities/:id`    | Get city by ID       |
| `PATCH`  | `/cities/:id`    | Update city          |
| `DELETE` | `/cities/:id`    | Soft delete city     |

## 🔁 Token Flow

- **Access Token** expires in 15 mins
- **Refresh Token** stored securely in DB (7 days)
- Use `/auth/refresh` to get new tokens without re-login

## 🧪 Testing Examples

### Register & Login

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "securePassword123", "firstName": "John", "lastName": "Doe", "role": "admin"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "securePassword123"}'
```

### Protected Routes

```bash
# Get cities with pagination
curl -X GET "http://localhost:3000/cities?page=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create city
curl -X POST http://localhost:3000/cities \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "New York", "description": "The Big Apple"}'
```

## 📄 Database Schema

### User

```json
{
  "id": "number",
  "email": "string (unique)",
  "password": "string (hashed)",
  "firstName": "string",
  "lastName": "string",
  "role": "admin | user",
  "refreshToken": "string (hashed)"
}
```

### City

```json
{
  "id": "number",
  "name": "string (unique)",
  "description": "string",
  "active": "boolean",
  "deletedAt": "Date | null"
}
```

## 🔐 Authentication & Authorization

- JWT tokens for authentication (access + refresh)
- Role-based access control with custom guards
- Passwords hashed with bcrypt
- Refresh tokens securely stored in database

## 🗂️ Project Structure

```
src/
├── auth/           # Authentication logic
├── users/          # User management
├── cities/         # Cities CRUD
├── common/         # Guards, decorators, middleware
├── app.module.ts
└── main.ts
```

## 📜 Available Scripts

```bash
npm run start:dev    # Development server
npm run start:prod   # Production server
npm run build        # Build application
npm run test         # Run tests
```

## 🔧 Troubleshooting

**Database Issues:**

- Ensure PostgreSQL is running
- Check user permissions

**Token Issues:**

- Verify JWT secrets in `.env`
- Use refresh endpoint when access token expires
- Check `Authorization: Bearer <token>` format

**Permission Denied:**

- Verify user role in database
- Check endpoint permissions (admin vs user)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push and create Pull Request

---

**Happy Coding! 🚀**

### Tags

`nestjs` `typeorm` `postgresql` `jwt-auth` `refresh-tokens` `rbac` `crud-api` `typescript`
