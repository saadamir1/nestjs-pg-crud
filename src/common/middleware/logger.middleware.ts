import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from './logger'; // adjust path as needed

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const status = res.statusCode;
      const duration = Date.now() - start;
      logger.info(`${method} ${originalUrl} ${status} - ${duration}ms`);
    });

    next();
  }
}
