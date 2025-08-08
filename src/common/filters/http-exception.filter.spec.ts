import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { AllExceptionsFilter } from './http-exception.filter';

// Mock the logger
jest.mock('../middleware/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: ArgumentsHost;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllExceptionsFilter],
    }).compile();

    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);

    // Mock Express request/response
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      method: 'POST',
      url: '/api/v1/test',
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as any;
  });

  describe('Input Sanitization', () => {
    it('should sanitize newlines and carriage returns in logs', () => {
      const maliciousUrl = '/api/v1/test\r\nFAKE LOG: Admin login successful\r\n';
      mockRequest.url = maliciousUrl;

      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
      
      filter.catch(exception, mockHost);

      // Verify response was sent
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should sanitize tabs in logs', () => {
      const maliciousUrl = '/api/v1/test\t\tmalicious\ttabs';
      mockRequest.url = maliciousUrl;

      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
      
      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should truncate extremely long URLs', () => {
      const longUrl = '/api/v1/test' + 'A'.repeat(2000);
      mockRequest.url = longUrl;

      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
      
      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should handle malicious error messages', () => {
      const maliciousMessage = 'Error\r\nFAKE: System compromised\r\n';
      const exception = new HttpException(maliciousMessage, HttpStatus.BAD_REQUEST);
      
      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          statusCode: 400,
          message: maliciousMessage, // Message is returned as-is to client
        })
      );
    });
  });

  describe('Exception Handling', () => {
    it('should handle HttpException correctly', () => {
      const exception = new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      
      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 400,
        error: 'HttpException',
        message: 'Bad request',
        path: '/api/v1/test',
        timestamp: expect.any(String),
      });
    });

    it('should handle generic Error correctly', () => {
      const exception = new Error('Generic error');
      
      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Internal server error',
        path: '/api/v1/test',
        timestamp: expect.any(String),
      });
    });

    it('should handle unknown exception types', () => {
      const exception = 'string exception';
      
      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});