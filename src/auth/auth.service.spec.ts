import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../common/services/email.service';
import { AuditService } from '../common/services/audit.service';
import { UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let emailService: EmailService;
  let auditService: AuditService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    refreshToken: 'hashedRefreshToken',
    isEmailVerified: true,
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockEmailService = {
    sendPasswordResetEmail: jest.fn(),
    sendEmailVerification: jest.fn(),
  };

  const mockAuditService = {
    log: jest.fn(),
  };

  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: EmailService, useValue: mockEmailService },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);
    auditService = module.get<AuditService>(AuditService);
    
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await module.close();
  });

  // ========== ORIGINAL TESTS ==========
  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        refreshToken: 'hashedRefreshToken',
        isEmailVerified: true,
      });
    });

    it('should return null when user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      mockJwtService.sign
        .mockReturnValueOnce('access_token')
        .mockReturnValueOnce('refresh_token');

      const result = await service.generateTokens(mockUser);

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });
    });
  });

  describe('login', () => {
    it('should login user and return tokens', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedBcrypt.hash.mockResolvedValue('hashedRefreshToken' as never);
      mockJwtService.sign
        .mockReturnValueOnce('access_token')
        .mockReturnValueOnce('refresh_token');

      const result = await service.login('test@example.com', 'password');

      expect(result).toEqual({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });
      expect(mockUsersService.update).toHaveBeenCalledWith(1, {
        refreshToken: 'hashedRefreshToken',
      });
      expect(mockAuditService.log).toHaveBeenCalledWith(
        1,
        'LOGIN',
        'User',
        1,
        'User logged in successfully'
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login('test@example.com', 'password')).rejects.toThrow(
        new UnauthorizedException('User not found'),
      );
    });

    it('should throw UnauthorizedException when password is wrong', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(service.login('test@example.com', 'wrongpassword')).rejects.toThrow(
        new UnauthorizedException('Wrong password'),
      );
    });
  });

  describe('refresh', () => {
    it('should refresh tokens when valid refresh token provided', async () => {
      const payload = { sub: 1, email: 'test@example.com', role: 'user' };
      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedBcrypt.hash.mockResolvedValue('newHashedRefreshToken' as never);
      mockJwtService.sign
        .mockReturnValueOnce('new_access_token')
        .mockReturnValueOnce('new_refresh_token');

      const result = await service.refresh('valid_refresh_token');

      expect(result).toEqual({
        access_token: 'new_access_token',
        refresh_token: 'new_refresh_token',
      });
    });

    it('should throw ForbiddenException when refresh token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refresh('invalid_token')).rejects.toThrow(
        new ForbiddenException('Invalid or expired refresh token'),
      );
    });

    it('should throw ForbiddenException when user has no stored refresh token', async () => {
      const payload = { sub: 1, email: 'test@example.com', role: 'user' };
      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findOne.mockResolvedValue({ ...mockUser, refreshToken: null });

      await expect(service.refresh('valid_refresh_token')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  // ========== NEW TESTS FOR EMAIL VERIFICATION ==========

  describe('sendEmailVerification', () => {
    it('should send verification email for existing unverified user', async () => {
      const unverifiedUser = { ...mockUser, isEmailVerified: false };
      mockUsersService.findByEmail.mockResolvedValue(unverifiedUser);
      mockUsersService.update.mockResolvedValue(unverifiedUser);
      mockEmailService.sendEmailVerification.mockResolvedValue(undefined);

      const result = await service.sendEmailVerification('test@example.com');

      expect(result.message).toBe('Verification email sent');
      expect(mockUsersService.update).toHaveBeenCalled();
      expect(mockEmailService.sendEmailVerification).toHaveBeenCalled();
    });

    it('should return message for non-existent user without revealing existence', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.sendEmailVerification('nonexistent@example.com');

      expect(result.message).toBe('If email exists, verification link has been sent');
      expect(mockEmailService.sendEmailVerification).not.toHaveBeenCalled();
    });

    it('should return message for already verified user', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.sendEmailVerification('test@example.com');

      expect(result.message).toBe('Email is already verified');
      expect(mockEmailService.sendEmailVerification).not.toHaveBeenCalled();
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with valid token', async () => {
      const userWithToken = {
        ...mockUser,
        isEmailVerified: false,
        emailVerificationToken: 'valid-token',
        emailVerificationTokenExpires: new Date(Date.now() + 60000),
      };
      mockUsersService.findAll.mockResolvedValue([userWithToken]);
      mockUsersService.update.mockResolvedValue({ ...userWithToken, isEmailVerified: true });

      const result = await service.verifyEmail('valid-token');

      expect(result.message).toBe('Email verified successfully');
      expect(mockUsersService.update).toHaveBeenCalledWith(1, {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpires: null,
      });
    });

    it('should throw error for invalid token', async () => {
      mockUsersService.findAll.mockResolvedValue([]);

      await expect(service.verifyEmail('invalid-token')).rejects.toThrow(BadRequestException);
    });

    it('should throw error for expired token', async () => {
      const userWithExpiredToken = {
        ...mockUser,
        emailVerificationToken: 'expired-token',
        emailVerificationTokenExpires: new Date(Date.now() - 60000),
      };
      mockUsersService.findAll.mockResolvedValue([userWithExpiredToken]);

      await expect(service.verifyEmail('expired-token')).rejects.toThrow(BadRequestException);
    });
  });

  describe('login with email verification', () => {
    it('should block login for unverified email', async () => {
      const unverifiedUser = { ...mockUser, isEmailVerified: false };
      mockUsersService.findByEmail.mockResolvedValue(unverifiedUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      await expect(service.login('test@example.com', 'password')).rejects.toThrow(
        new UnauthorizedException('Please verify your email before logging in')
      );
    });
  });
});