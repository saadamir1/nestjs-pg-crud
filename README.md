# NestJS PostgreSQL CRUD API with Auth & RBAC

A full-featured REST API built with NestJS, PostgreSQL, and TypeORM with JWT authentication, refresh tokens, role-based access control, database migrations, and CRUD operations.

## 🛠️ Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript with migration support
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
- 🔄 **Database Migrations** - Version control for database schema
- 🎯 **Type Safety** - Full TypeScript support
- 🧪 **Easy Testing** - Ready for Postman/curl
- 🖥️ **Frontend Test Page** - Basic HTML interface for API testing

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
NODE_ENV=development
```

### 4. Run Database Migrations

```bash
# Run existing migrations
npm run migration:run

# Check migration status
npm run migration:show
```

### 5. Run Application

```bash
npm run start:dev
```

API available at `http://localhost:3000`

## 🧪 API Endpoints

### 🔐 Auth

| Method | Endpoint         | Description                |
| ------ | ---------------- | -------------------------- |
| `POST` | `/auth/register` | Register user (admin only) |
| `POST` | `/auth/login`    | Login and get tokens       |
| `POST` | `/auth/refresh`  | Refresh access token       |
| `GET`  | `/auth/me`       | Get current user           |

### 👤 Users (Protected)

| Method | Endpoint         | Description                |
| ------ | ---------------- | -------------------------- |
| `GET`  | `/users`         | Get all users (admin only) |
| `GET`  | `/users/profile` | Get user profile           |
| `POST` | `/users/`         | Create user (admin only)   |

### 🌍 Cities (Protected)

| Method   | Endpoint                  | Description          |
| -------- | ------------------------- | -------------------- |
| `POST`   | `/cities`                 | Create city          |
| `GET`    | `/cities?page=1&limit=10` | Get paginated cities |
| `GET`    | `/cities/:id`             | Get city by ID       |
| `PATCH`  | `/cities/:id`             | Update city          |
| `DELETE` | `/cities/:id`             | Soft delete city     |

## 🔁 Token Flow

- **Access Token** expires in 15 mins
- **Refresh Token** stored securely in DB (7 days)
- Use `/auth/refresh` to get new tokens without re-login

## 🗃️ Database Migrations

### Migration Commands

```bash
# Generate migration from entity changes
npm run migration:generate src/migrations/YourMigrationName

# Create empty migration
npm run migration:create src/migrations/YourMigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

### Migration Workflow

1. **Modify entities** → Update your TypeORM entities
2. **Generate migration** → `npm run migration:generate src/migrations/FeatureName`
3. **Review migration** → Check generated SQL in migration file
4. **Run migration** → `npm run migration:run`
5. **Deploy** → Migrations run automatically in production

### Production Deployment

```bash
# Build application
npm run build

# Run migrations
npm run migration:run

# Start production server
npm run start:prod
```

## 🧪 Testing Examples

### Register & Login

```bash
# Register (admin only - requires JWT token)
curl -X POST http://localhost:3000/auth/register \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securePassword123", "firstName": "John", "lastName": "Doe"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securePassword123"}'
```

### Protected Routes

```bash
# Get cities with pagination (default: page=1, limit=10)
curl -X GET "http://localhost:3000/cities?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create city
curl -X POST http://localhost:3000/cities \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "New York", "description": "The Big Apple"}'
```

### Frontend Test Interface

Open `frontend-test.html` in your browser for a basic HTML interface to test the API endpoints.

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

### City (Pagination Response)

```json
{
  "data": [
    {
      "id": "number",
      "name": "string (unique)",
      "description": "string",
      "active": "boolean",
      "deletedAt": "Date | null"
    }
  ],
  "total": "number",
  "page": "number",
  "lastPage": "number"
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
├── auth/              # Authentication logic
├── users/             # User management
├── cities/            # Cities CRUD
├── common/            # Guards, decorators, middleware
├── migrations/        # Database migrations
├── data-source.ts     # TypeORM CLI configuration
├── migration.config.ts # Migration configuration
├── app.module.ts
└── main.ts
frontend-test.html     # Basic API testing interface
```

## 📜 Available Scripts

```bash
# Development
npm run start:dev              # Development server
npm run start:prod             # Production server
npm run build                  # Build application

# Testing
npm run test                   # Run tests
npm run test:watch             # Watch mode tests
npm run test:e2e               # End-to-end tests

# Database Migrations
npm run migration:generate     # Generate migration from entities
npm run migration:create       # Create empty migration
npm run migration:run          # Run pending migrations
npm run migration:revert       # Revert last migration
npm run migration:show         # Show migration status
```

## 🔧 Troubleshooting

**Database Issues:**

- Ensure PostgreSQL is running
- Check user permissions
- Run `npm run migration:show` to check migration status

**Migration Issues:**

- Ensure `NODE_ENV` is set in `.env`
- Check `src/data-source.ts` configuration
- Verify migration files are in `src/migrations/`

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
3. Make changes and add migrations if needed
4. Run `npm run migration:generate` for schema changes
5. Commit changes with descriptive messages
6. Push and create Pull Request

---

**Happy Coding! 🚀**

### Tags

`nestjs` `typeorm` `postgresql` `jwt-auth` `refresh-tokens` `rbac` `crud-api` `typescript` `migrations` `database-versioning`
