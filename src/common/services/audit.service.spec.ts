import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { Repository } from 'typeorm';

describe('AuditService', () => {
  let service: AuditService;
  let repository: jest.Mocked<Repository<AuditLog>>;

  const mockAuditLog = {
    id: 1,
    userId: 1,
    action: 'LOGIN',
    entity: 'User',
    entityId: 1,
    details: 'User logged in successfully',
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0',
    createdAt: new Date(),
  };

  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: getRepositoryToken(AuditLog),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    repository = module.get(getRepositoryToken(AuditLog));
  });

  afterEach(async () => {
    await module.close();
  });

  describe('log', () => {
    it('should create and save audit log', async () => {
      repository.create.mockReturnValue(mockAuditLog as any);
      repository.save.mockResolvedValue(mockAuditLog as any);

      await service.log(1, 'LOGIN', 'User', 1, 'User logged in', '127.0.0.1', 'Mozilla/5.0');

      expect(repository.create).toHaveBeenCalledWith({
        userId: 1,
        action: 'LOGIN',
        entity: 'User',
        entityId: 1,
        details: 'User logged in',
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
      });
      expect(repository.save).toHaveBeenCalled();
    });

    it('should handle null userId', async () => {
      repository.create.mockReturnValue(mockAuditLog as any);
      repository.save.mockResolvedValue(mockAuditLog as any);

      await service.log(null, 'FAILED_LOGIN', 'User', undefined, 'Failed login attempt');

      expect(repository.create).toHaveBeenCalledWith({
        userId: undefined,
        action: 'FAILED_LOGIN',
        entity: 'User',
        entityId: undefined,
        details: 'Failed login attempt',
        ipAddress: undefined,
        userAgent: undefined,
      });
    });
  });

  describe('getUserActivity', () => {
    it('should return user activity logs', async () => {
      const mockLogs = [mockAuditLog];
      repository.find.mockResolvedValue(mockLogs as any);

      const result = await service.getUserActivity(1, 10);

      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        order: { createdAt: 'DESC' },
        take: 10,
      });
      expect(result).toEqual(mockLogs);
    });
  });

  describe('getRecentActivity', () => {
    it('should return recent activity logs', async () => {
      const mockLogs = [mockAuditLog];
      repository.find.mockResolvedValue(mockLogs as any);

      const result = await service.getRecentActivity(50);

      expect(repository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        take: 50,
      });
      expect(result).toEqual(mockLogs);
    });
  });
});