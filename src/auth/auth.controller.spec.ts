import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  const mockAuthService = {
    login: jest.fn(),
    refresh: jest.fn(),
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return tokens on successful login', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const tokens = { access_token: 'token', refresh_token: 'refresh' };
      
      mockAuthService.login.mockResolvedValue(tokens);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(result).toEqual(tokens);
    });
  });

  describe('refresh', () => {
    it('should return new tokens on successful refresh', async () => {
      const refreshDto = { refreshToken: 'valid_refresh_token' };
      const tokens = { access_token: 'new_token', refresh_token: 'new_refresh' };
      
      mockAuthService.refresh.mockResolvedValue(tokens);

      const result = await controller.refresh(refreshDto);

      expect(authService.refresh).toHaveBeenCalledWith(refreshDto.refreshToken);
      expect(result).toEqual(tokens);
    });

    it('should throw ForbiddenException when refresh token is missing', async () => {
      await expect(controller.refresh({ refreshToken: '' })).rejects.toThrow(
        new ForbiddenException('Missing refresh token'),
      );
    });
  });

  describe('register', () => {
    it('should create a new user when email is not in use', async () => {
      const registerDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'new@example.com',
        password: 'password',
      };
      const createdUser = { id: 1, ...registerDto };
      
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await controller.register(registerDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(usersService.create).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(createdUser);
    });

    it('should throw UnauthorizedException when email is already in use', async () => {
      const registerDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        password: 'password',
      };
      
      mockUsersService.findByEmail.mockResolvedValue({ id: 1, email: registerDto.email });

      await expect(controller.register(registerDto)).rejects.toThrow(
        new UnauthorizedException('Email already in use'),
      );
    });
  });

  describe('getMe', () => {
    it('should return current user', () => {
      const user = { id: 1, email: 'test@example.com' };
      
      const result = controller.getMe(user);
      
      expect(result).toEqual(user);
    });
  });
});
