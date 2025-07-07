import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

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
        ? exception.getResponse() // Use built-in response if available
        : 'Internal server error'; // Fallback message

    // Send a structured JSON response
    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
// This filter will be used globally in main.ts
// app.useGlobalFilters(new AllExceptionsFilter());
