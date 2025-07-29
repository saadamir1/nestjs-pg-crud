import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { CitiesModule } from './cities/cities.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 3, // 3 requests per second
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 20, // 20 requests per 10 seconds
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        // If DATABASE_URL is provided (production), use it
        if (databaseUrl) {
          console.log('Using DATABASE_URL for connection');
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [join(process.cwd(), 'dist', '**', '*.entity{.ts,.js}')],
            autoLoadEntities: true,
            // Remove synchronize in production and use migrations instead
            // Temporarily enable synchronize for initial production setup
            synchronize: true, // Set to false after first successful deployment
            // Migration configuration
            migrations: [
              join(process.cwd(), 'dist', 'migrations', '*.{ts,js}'),
            ],
            migrationsTableName: 'migrations',
            migrationsRun: false, // Disable migration running temporarily
            logging: configService.get<string>('NODE_ENV') === 'development',
            ssl:
              configService.get<string>('NODE_ENV') === 'production'
                ? { rejectUnauthorized: false }
                : false,
          };
        }

        // Fallback to individual variables (development)
        console.log('Using individual DB variables for connection');
        console.log('DB_HOST:', configService.get('DB_HOST'));
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [join(process.cwd(), 'dist', '**', '*.entity{.ts,.js}')],
          autoLoadEntities: true,
          synchronize: configService.get<string>('NODE_ENV') === 'development',
          migrations: [join(process.cwd(), 'dist', 'migrations', '*.{ts,js}')],
          migrationsTableName: 'migrations',
          migrationsRun: false,
          logging: configService.get<string>('NODE_ENV') === 'development',
        };
      },
    }),
    CitiesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
