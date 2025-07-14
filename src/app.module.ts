import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CitiesModule } from './cities/cities.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
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
          // Remove synchronize in production and use migrations instead
          synchronize: configService.get<string>('NODE_ENV') === 'development',
          // Migration configuration
          migrations: [join(process.cwd(), 'dist', 'migrations', '*.{ts,js}')],
          migrationsTableName: 'migrations',
          migrationsRun: configService.get<string>('NODE_ENV') === 'production',
          logging: configService.get<string>('NODE_ENV') === 'development',
        };
      },
    }),
    CitiesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
