import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

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
      origin: ['https://production-domain.com'],
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

  await app.listen(process.env.PORT ?? 3000);
  console.log('API running on http://localhost:3000');
}
bootstrap();
