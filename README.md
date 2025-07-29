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
- 🧪 **Comprehensive Testing** - Unit tests, E2E tests, and test coverage
- 📚 **API Documentation** - Interactive Swagger/OpenAPI documentation
- 🛡️ **Rate Limiting** - Prevents API abuse with configurable limits
- 🖥️ **Frontend Test Page** - Basic HTML interface for API testing
- ⚡ **Production Ready** - Error handling, validation, and security best practices

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
Swagger documentation at `http://localhost:3000/api`

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
| `POST` | `/users/`        | Create user (admin only)   |

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

### API Documentation

Interactive Swagger documentation is available at `http://localhost:3000/api` where you can:

- View all available endpoints
- Test API calls directly from the browser
- See request/response schemas
- Authenticate with JWT tokens

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

## 🛡️ Rate Limiting

**Global Rate Limits:**

- **Short**: 3 requests per second
- **Medium**: 20 requests per 10 seconds
- **Long**: 100 requests per minute

**Endpoint-Specific Limits:**

- **Login**: 5 attempts per minute (prevents brute force)
- **Refresh Token**: 10 attempts per minute

**Headers Returned:**

- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset time

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

## 🧪 Testing

This project includes comprehensive testing with **44 unit tests** and **E2E tests** covering all endpoints.

### Unit Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

**Test Coverage:**

- ✅ **Services**: All CRUD operations, authentication, validation
- ✅ **Controllers**: HTTP endpoints, request/response handling
- ✅ **Auth**: Login, refresh tokens, JWT validation
- ✅ **Error Handling**: 404s, validation errors, unauthorized access

### E2E Tests

```bash
# Run end-to-end tests
npm run test:e2e
```

**E2E Test Coverage:**

- ✅ **Authentication**: Login, protected routes
- ✅ **Cities CRUD**: Create, read, update, delete operations
- ✅ **Authorization**: Admin-only endpoints
- ✅ **Error Cases**: Invalid data, non-existent resources
- ✅ **Database**: Proper cleanup and isolation

### Test Structure

```
src/
├── **/*.spec.ts           # Unit tests (Jest)
└── **/*.service.spec.ts    # Service layer tests
test/
├── *.e2e-spec.ts          # End-to-end tests
└── jest-e2e.config.json   # E2E Jest configuration
```

## 📜 Available Scripts

```bash
# Development
npm run start:dev              # Development server
npm run start:prod             # Production server
npm run build                  # Build application

# Testing
npm run test                   # Run unit tests
npm run test:watch             # Watch mode tests
npm run test:cov               # Test coverage report
npm run test:e2e               # End-to-end tests
npm run test:debug             # Debug tests

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

**Rate Limiting Issues:**

- Check `X-RateLimit-*` headers in response
- Wait for rate limit reset time
- Consider implementing exponential backoff
- Contact admin if limits seem too restrictive

**Test Issues:**

- Run `npm run test:cov` to check test coverage
- Use `npm run test:e2e` for integration testing
- Check database connection for E2E tests
- Ensure test database is separate from development

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes and add migrations if needed
4. **Write tests** for new features
5. Run `npm run test` and `npm run test:e2e` to ensure all tests pass
6. Run `npm run migration:generate` for schema changes
7. Commit changes with descriptive messages
8. Push and create Pull Request

### Development Workflow

```bash
# 1. Install dependencies
npm install

# 2. Set up database and run migrations
npm run migration:run

# 3. Start development server
npm run start:dev

# 4. Run tests during development
npm run test:watch

# 5. Run E2E tests before committing
npm run test:e2e
```

---

**Happy Coding! 🚀**

## 📈 Project Stats

- **44 Unit Tests** - Comprehensive service and controller testing
- **12 E2E Tests** - Full API workflow testing
- **100% TypeScript** - Full type safety
- **JWT Security** - Access + refresh token implementation
- **Database Migrations** - Version-controlled schema changes
- **Production Ready** - Error handling, validation, logging

### Tags

`nestjs` `typeorm` `postgresql` `jwt-auth` `refresh-tokens` `rbac` `crud-api` `typescript` `migrations` `database-versioning` `jest-testing` `e2e-testing` `production-ready`
