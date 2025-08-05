import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Development CORS - allows all origins
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: true, // This allows all origins in development
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
  } else {
    // Production CORS - restrictive
    app.enableCors({
      origin: [
        'https://pg-crud-frontend-44cu.vercel.app',
        'https://pg-crud-frontend-44cu-saadamir1s-projects.vercel.app/',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown properties
      forbidNonWhitelisted: true, // throws error on unknown props
      transform: true, // auto-transforms payloads to DTO classes
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter()); // handles unhandled exceptions globally

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NestJS Professional Foundation API')
    .setDescription(
      'Production-ready REST API with JWT authentication, RBAC, audit logging, and comprehensive features',
    )
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Development')
    .addServer('https://nestjs-pg-crud.onrender.com', 'Production')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('cities', 'Cities CRUD endpoints (Example)')
    .addTag('upload', 'File upload endpoints')
    .addTag('health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
      tryItOutEnabled: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('API running on http://localhost:3000');
  console.log('API v1 available at http://localhost:3000/api/v1');
  console.log('Swagger documentation available at http://localhost:3000/api/docs');
}
bootstrap();
