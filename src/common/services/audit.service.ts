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
  }

  async getUserActivity(userId: number, limit: number = 50): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getRecentActivity(limit: number = 100): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}