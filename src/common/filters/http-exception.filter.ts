import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from '../middleware/logger'; // Import your winston logger

// This filter catches all unhandled exceptions in the app
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // Called automatically when an exception is thrown
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // Get HTTP context
    const response = ctx.getResponse<Response>(); // Express response object
    const request = ctx.getRequest<Request>(); // Express request object

    // Determine HTTP status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus() // If it's an HttpException, use its status
        : HttpStatus.INTERNAL_SERVER_ERROR; // Otherwise, return 500

    // Extract message to send back to client
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any)?.message || exception.message
        : 'Internal server error';

    // Log the exception details for debugging
    this.logException(exception, request, status);

    // Send a structured JSON response
    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private logException(exception: unknown, request: Request, status: number) {
    const { method, url } = request;
    const timestamp = new Date().toISOString();

    // Create base log context
    const logContext = {
      method,
      url,
      statusCode: status,
      timestamp,
    };

    if (exception instanceof HttpException) {
      // For HTTP exceptions, log with appropriate level
      const logMessage = `HTTP Exception: ${method} ${url} - ${status}`;

      if (status >= 500) {
        // Server errors - log as error with full details
        logger.error(logMessage, {
          ...logContext,
          error: exception.message,
          stack: exception.stack,
          response: exception.getResponse(),
        });
      } else if (status >= 400) {
        // Client errors - log as warning (less verbose)
        logger.warn(logMessage, {
          ...logContext,
          error: exception.message,
        });
      } else {
        // Unexpected but not error (shouldn't happen in exception filter)
        logger.info(logMessage, logContext);
      }
    } else if (exception instanceof Error) {
      // For general errors, always log as error
      logger.error(`Unhandled Error: ${method} ${url} - ${status}`, {
        ...logContext,
        error: exception.message,
        stack: exception.stack,
        name: exception.name,
      });
    } else {
      // For unknown exception types
      logger.error(`Unknown Exception: ${method} ${url} - ${status}`, {
        ...logContext,
        error: String(exception),
        type: typeof exception,
      });
    }
  }
}

// This filter will be used globally in main.ts
// app.useGlobalFilters(new AllExceptionsFilter());
