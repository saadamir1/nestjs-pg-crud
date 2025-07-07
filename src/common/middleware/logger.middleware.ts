// logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from './logger'; // Import the configured winston logger

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // Middleware runs on every incoming HTTP request
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req; // Extract request method and URL
    const start = Date.now(); // Record request start time

    // This event runs when the response has been fully sent
    res.on('finish', () => {
      const status = res.statusCode; // Get the response status code
      const duration = Date.now() - start; // Calculate total request duration (in ms)

      // Log the structured message using winston (goes to console + file)
      logger.info(`${method} ${originalUrl} ${status} - ${duration}ms`);
    });

    // Call the next middleware or controller
    next();
  }
}
