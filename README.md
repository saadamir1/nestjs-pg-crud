# NestJS Professional Foundation

A comprehensive, production-ready NestJS foundation with advanced authentication, security, file handling, and enterprise-grade features. Built with PostgreSQL, TypeORM, JWT authentication, refresh tokens, role-based access control, audit logging, and comprehensive testing.

## 🛠️ Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript with migration support
- **PostgreSQL** - Relational database
- **JWT** - Access and refresh token authentication
- **bcrypt** - Password hashing
- **Cloudinary** - Cloud-based image storage and optimization
- **Winston** - Logging library
- **Nodemailer** - Email service for password reset and verification
- **Multer** - File upload handling
- **TypeScript** - Type safety

## ✨ Features

- 🔐 **JWT Authentication** (Access + Refresh Tokens)
- 🔄 **Token Refresh Mechanism**
- 🛡️ **Role-Based Access Control** (Admin/User)
- 🔒 **Hashed Passwords with bcrypt**
- 📧 **Password Reset via Email** (Secure token-based reset)
- ✉️ **Email Service Integration** (Nodemailer with Gmail)
- 📋 **Pagination Support** (e.g., `/cities?page=2`)
- 🧹 **Soft Delete Support** (e.g., cities)
- 📁 **File Upload** - Image upload with Cloudinary integration
- 🖼️ **Image Processing** - Automatic optimization and transformation
- 🧾 **Request Logging** - Winston logger with file output
- 📊 **Audit Logging** - User activity tracking for security and compliance
- 🚀 **RESTful API Structure**
- 📊 **Database Integration** - PostgreSQL with TypeORM
- 🔄 **Database Migrations** - Version control for database schema
- 🎯 **Type Safety** - Full TypeScript support
- 🧪 **Comprehensive Testing** - Unit tests, E2E tests, and test coverage
- 📚 **API Documentation** - Interactive Swagger/OpenAPI documentation
- 🔢 **API Versioning** - URI-based versioning (e.g., `/api/v1/users`)
- 🛡️ **Rate Limiting** - Prevents API abuse with configurable limits
- 🚀 **Live Deployment** - Production-ready app deployed on Render.com
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

Copy and configure environment:

```bash
cp .env.example .env
# Edit .env with your actual values
```

Or create `.env` manually:

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

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (for password reset)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:3001

# Production Database URL (optional)
DATABASE_URL=postgresql://username:password@host:port/database
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

**Local Development:**

- API v1: `http://localhost:3000/api/v1`
- Health Check: `http://localhost:3000`
- Swagger: `http://localhost:3000/api/docs`

**🚀 Live Production:**

- API v1: `https://nestjs-pg-crud.onrender.com/api/v1`
- Health Check: `https://nestjs-pg-crud.onrender.com`
- Swagger: `https://nestjs-pg-crud.onrender.com/api/docs`

## 🧪 API Endpoints

### 🔐 Auth

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| `POST` | `/api/v1/auth/register`        | Register user (admin only) |
| `POST` | `/api/v1/auth/login`           | Login and get tokens       |
| `POST` | `/api/v1/auth/refresh`         | Refresh access token       |
| `POST` | `/api/v1/auth/forgot-password` | Request password reset     |
| `POST` | `/api/v1/auth/reset-password`  | Reset password with token  |
| `POST` | `/api/v1/auth/send-verification` | Send email verification  |
| `POST` | `/api/v1/auth/verify-email`    | Verify email with token    |
| `POST` | `/api/v1/auth/bootstrap-admin` | Create first admin user    |
| `GET`  | `/api/v1/auth/me`              | Get current user           |

### 👤 Users (Protected)

| Method   | Endpoint              | Description                |
| -------- | --------------------- | -------------------------- |
| `GET`    | `/api/v1/users`              | Get all users (admin only) |
| `GET`    | `/api/v1/users/profile`      | Get user profile           |
| `GET`    | `/api/v1/users/:id`          | Get user by ID             |
| `PATCH`  | `/api/v1/users/profile`      | Update user profile        |
| `PATCH`  | `/api/v1/users/change-password` | Change user password    |
| `PATCH`  | `/api/v1/users/:id`          | Update user (admin only)   |
| `DELETE` | `/api/v1/users/:id`          | Delete user (admin only)   |

### 🌍 Cities (Example Module)

> **Note**: Cities module is included as a complete CRUD example - replace with your business logic.

| Method   | Endpoint                  | Description          |
| -------- | ------------------------- | -------------------- |
| `POST`   | `/api/v1/cities`                 | Create city          |
| `GET`    | `/api/v1/cities?page=1&limit=10` | Get paginated cities |
| `GET`    | `/api/v1/cities/:id`             | Get city by ID       |
| `PATCH`  | `/api/v1/cities/:id`             | Update city          |
| `DELETE` | `/api/v1/cities/:id`             | Soft delete city     |

### 📁 File Upload (Protected)

| Method | Endpoint                          | Description                            |
| ------ | --------------------------------- | -------------------------------------- |
| `POST` | `/api/v1/upload/image`                   | Upload general image file              |
| `POST` | `/api/v1/upload/avatar`                  | Upload user avatar image               |
| `POST` | `/api/v1/upload/profile-picture/:userId` | Upload and update user profile picture |
| `POST` | `/api/v1/upload/city-image/:cityId`      | Upload and update city image           |

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
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securePassword123", "firstName": "John", "lastName": "Doe"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securePassword123"}'

# Forgot Password
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# Reset Password
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token": "reset-token-from-email", "newPassword": "newSecurePassword123"}'

# Send Email Verification
curl -X POST http://localhost:3000/auth/send-verification \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# Verify Email
curl -X POST http://localhost:3000/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "verification-token-from-email"}'

# Bootstrap Admin (First time setup)
curl -X POST http://localhost:3000/auth/bootstrap-admin \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123", "firstName": "Admin", "lastName": "User"}'
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

# Upload image file
curl -X POST http://localhost:3000/upload/image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/image.jpg"

# Upload avatar
curl -X POST http://localhost:3000/upload/avatar \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/avatar.png"

# Upload user profile picture
curl -X POST http://localhost:3000/upload/profile-picture/2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/profile.jpg"

# Upload city image
curl -X POST http://localhost:3000/upload/city-image/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/city.jpg"

# Update user profile
curl -X PATCH http://localhost:3000/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Updated", "lastName": "Name"}'

# Change password
curl -X PATCH http://localhost:3000/users/change-password \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword": "oldPassword", "newPassword": "newPassword123"}'
```

### API Documentation

**🚀 Live Production API:**
Interactive Swagger documentation is available at `https://nestjs-pg-crud.onrender.com/api` where you can:

- View all available endpoints
- Test API calls directly from the browser
- See request/response schemas
- Authenticate with JWT tokens

**Local Development:**
Swagger documentation available at `http://localhost:3000/api`

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

````
src/
├── auth/              # Authentication logic
├── users/             # User management
├── cities/            # Cities CRUD
├── upload/            # File upload functionality
├── common/            # Guards, decorators, middleware, services
│   ├── services/      # Cloudinary, Email, Audit services
│   ├── entities/      # Audit log entity
│   └── middleware/    # Logger middleware
├── migrations/        # Database migrations
├── data-source.ts     # TypeORM CLI configuration
├── migration.config.ts # Migration configuration
├── app.module.ts
└── main.ts
logs/                  # Application logs
frontend-test.html     # Basic API testing interface
```e, services
│   ├── services/      # Cloudinary service
│   └── middleware/    # Logger middleware
├── migrations/        # Database migrations
├── data-source.ts     # TypeORM CLI configuration
├── migration.config.ts # Migration configuration
├── app.module.ts
└── main.ts
logs/                  # Application logs
frontend-test.html     # Basic API testing interface
````

## 🧪 Testing

This project includes comprehensive testing with **60 unit tests** and **6 E2E tests** (2 test suites) covering critical functionality.

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

- ✅ **Services**: All CRUD operations, authentication, email verification, profile management
- ✅ **Controllers**: HTTP endpoints, request/response handling
- ✅ **Auth**: Login, refresh tokens, JWT validation, email verification
- ✅ **Users**: Profile updates, password changes, user management
- ✅ **Audit**: Activity logging and tracking
- ✅ **Error Handling**: 404s, validation errors, unauthorized access

### E2E Tests

```bash
# Run end-to-end tests
npm run test:e2e
```

**E2E Test Coverage:**

- ✅ **Health Check**: API status endpoint
- ✅ **Email Verification**: Send verification, verify email, login blocking
- ✅ **Authentication Flow**: Complete email verification workflow
- ✅ **Database**: Proper cleanup and isolation

### Test Structure

```
src/
├── **/*.spec.ts           # Unit tests (Jest)
└── **/*.service.spec.ts    # Service layer tests
test/
├── email-verification.e2e-spec.ts  # Email verification E2E tests
├── app.e2e-spec.ts                 # Health check E2E test
└── jest-e2e.config.json            # E2E Jest configuration
```

### Test Management

**Note**: Some E2E tests were removed due to rate limiting conflicts. The comprehensive unit test suite (60 tests) provides complete coverage of all business logic.

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

**Email Issues:**

- Check Gmail app password is correct (16 characters)
- Verify 2-Factor Authentication is enabled on Gmail
- Check spam folder for reset emails
- Ensure `EMAIL_USER` and `EMAIL_PASS` are set in `.env`
- Verify `FRONTEND_URL` matches your frontend domain

**Permission Denied:**

- Verify user role in database
- Check endpoint permissions (admin vs user)

**File Upload Issues:**

- Check Cloudinary credentials in `.env`
- Verify file size (max 5MB) and type (JPEG, PNG, GIF, WebP)
- Ensure proper `multipart/form-data` content type
- Check network connectivity to Cloudinary

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

## 🐳 Docker Support

### Quick Start with Docker

```bash
# Start entire stack (app + database)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

### Production Docker Build

```bash
# Build image
docker build -t nestjs-enterprise .

# Run container
docker run -p 3000:3000 --env-file .env nestjs-enterprise
```

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

- **60 Unit Tests** - Comprehensive service and controller testing
- **6 E2E Tests** - Health check and email verification workflows
- **100% TypeScript** - Full type safety
- **JWT Security** - Access + refresh token implementation
- **Email Verification** - Token-based email verification system
- **Audit Logging** - User activity tracking for security
- **Profile Management** - User profile updates and password changes
- **Database Migrations** - Version-controlled schema changes
- **Live Deployment** - Successfully deployed on Render.com
- **Production Ready** - Error handling, validation, logging, comprehensive testing

### Tags

`nestjs` `typeorm` `postgresql` `jwt-auth` `refresh-tokens` `rbac` `crud-api` `typescript` `migrations` `database-versioning` `jest-testing` `e2e-testing` `file-upload` `cloudinary` `winston-logging` `production-ready`
