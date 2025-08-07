import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

const TEST_PASSWORD = 'testPassword123';
const TEST_HASHED_PASSWORD = '$2b$10$testHashedPassword';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: TEST_HASHED_PASSWORD,
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    refreshToken: null,
  };

  const mockUsers = [mockUser, { ...mockUser, id: 2, email: 'admin@example.com', role: 'admin' }];

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await module.close();
  });

  // ========== ORIGINAL TESTS ==========
  describe('findAll', () => {
    it('should return all users', async () => {
      mockRepo.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(mockRepo.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        password: TEST_PASSWORD,
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'user',
      };

      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      mockRepo.create.mockReturnValue(mockUser);
      mockRepo.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(TEST_PASSWORD, 10);
      expect(mockRepo.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });
      expect(mockRepo.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'Updated John' };
      const updatedUser = { ...mockUser, ...updateUserDto };

      mockRepo.preload.mockResolvedValue(updatedUser);
      mockRepo.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);

      expect(mockRepo.preload).toHaveBeenCalledWith({ id: 1, ...updateUserDto });
      expect(mockRepo.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockRepo.preload.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(
        new UnauthorizedException('User with id 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const deleteResult = { affected: 1 };
      mockRepo.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(1);

      expect(mockRepo.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleteResult);
    });
  });

  // ========== NEW TESTS FOR PROFILE MANAGEMENT ==========

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const updateData = { firstName: 'Updated', lastName: 'Name' };
      const updatedUser = { ...mockUser, ...updateData };

      mockRepo.findOne.mockResolvedValue(mockUser);
      mockRepo.save.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(1, updateData);

      expect(result.firstName).toBe('Updated');
      expect(result.lastName).toBe('Name');
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.updateProfile(999, { firstName: 'Test' })).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const changePasswordDto = {
        currentPassword: 'oldPassword123',
        newPassword: TEST_PASSWORD,
      };

      mockRepo.findOne.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedBcrypt.hash.mockResolvedValue('$2b$10$newHashedPassword' as never);
      mockRepo.save.mockResolvedValue({ ...mockUser, password: '$2b$10$newHashedPassword' });

      const result = await service.changePassword(1, changePasswordDto);

      expect(result.message).toBe('Password changed successfully');
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('oldPassword123', mockUser.password);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(TEST_PASSWORD, 10);
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('should throw error for incorrect current password', async () => {
      const changePasswordDto = {
        currentPassword: 'wrongPassword123',
        newPassword: TEST_PASSWORD,
      };

      mockRepo.findOne.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(service.changePassword(1, changePasswordDto)).rejects.toThrow(
        new BadRequestException('Current password is incorrect')
      );
    });

    it('should throw error if user not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.changePassword(999, { currentPassword: 'oldPassword123', newPassword: TEST_PASSWORD })
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});