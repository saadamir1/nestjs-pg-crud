# NestJS Foundation Boilerplate Setup

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd nestjs-foundation
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Database Setup

```sql
CREATE USER your_user WITH PASSWORD 'your_password';
CREATE DATABASE your_db OWNER your_user;
GRANT ALL PRIVILEGES ON DATABASE your_db TO your_user;
```

### 4. Run Migrations

```bash
npm run migration:run
```

### 5. Create Admin User

```bash
# Use bootstrap endpoint
POST /auth/bootstrap-admin
{
  "email": "admin@example.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User"
}
```

### 6. Start Development

```bash
npm run start:dev
```

## Available Features

- ✅ JWT Authentication + Refresh Tokens
- ✅ Email Verification + Password Reset
- ✅ Role-Based Access Control
- ✅ File Upload (Cloudinary)
- ✅ Audit Logging
- ✅ Rate Limiting
- ✅ API Documentation (Swagger)
- ✅ Database Migrations
- ✅ Global Error Handling
- ✅ Request Logging
- ✅ Unit + E2E Tests

## API Endpoints

- **Auth**: `/auth/*` - Login, register, verify email, reset password
- **Users**: `/users/*` - User management (admin only)
- **Upload**: `/upload/*` - File upload endpoints
- **Docs**: `/api` - Swagger documentation

## Customization

1. **Add new modules**: `nest g module feature-name`
2. **Add entities**: Create in `src/feature/entities/`
3. **Generate migrations**: `npm run migration:generate src/migrations/FeatureName`
4. **Add tests**: Create `.spec.ts` files alongside your code
