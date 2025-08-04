import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      message: 'NestJS CRUD API is running!',
      timestamp: new Date().toISOString(),
      status: 'healthy',
    };
  }
}
