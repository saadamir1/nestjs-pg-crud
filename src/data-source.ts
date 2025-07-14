import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables
config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST') || 'localhost',
  port: configService.get<number>('DB_PORT') || 5432,
  username: configService.get<string>('DB_USERNAME') || 'dev',
  password: configService.get<string>('DB_PASSWORD') || 'secret',
  database: configService.get<string>('DB_NAME') || 'demo',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*.{ts,js}'],
  migrationsTableName: 'migrations',
  synchronize: false, // Always false when using migrations
  logging: configService.get<string>('NODE_ENV') === 'development',
});
