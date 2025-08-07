import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(
    userId: number | null,
    action: string,
    entity: string,
    entityId?: number,
    details?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    try {
      const auditLog = this.auditLogRepository.create({
        userId: userId || undefined,
        action,
        entity,
        entityId,
        details,
        ipAddress,
        userAgent,
      });

      await this.auditLogRepository.save(auditLog);
    } catch (error) {
      console.error('Failed to save audit log:', error);
    }
  }

  async getUserActivity(userId: number, limit: number = 50): Promise<AuditLog[]> {
    try {
      return await this.auditLogRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: limit,
      });
    } catch (error) {
      console.error('Failed to get user activity:', error);
      return [];
    }
  }

  async getRecentActivity(limit: number = 100): Promise<AuditLog[]> {
    try {
      return await this.auditLogRepository.find({
        order: { createdAt: 'DESC' },
        take: limit,
      });
    } catch (error) {
      console.error('Failed to get recent activity:', error);
      return [];
    }
  }
}