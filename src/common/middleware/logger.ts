// logger.ts
// Import winston logging library
import * as winston from 'winston';

// Create and export a configured winston logger instance
export const logger = winston.createLogger({
  // Set the minimum log level (e.g., info, warn, error)
  level: 'info',

  // Combine multiple formatting options
  format: winston.format.combine(
    // Adds ISO timestamp to each log
    winston.format.timestamp(),

    // Custom format: [timestamp] LEVEL: message
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    }),
  ),

  // Define transports (where the logs should go)
  transports: [
    // Show logs in terminal/console
    new winston.transports.Console(),

    // Also save logs in a file (logs/app.log)
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
});
