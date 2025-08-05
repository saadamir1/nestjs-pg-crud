import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'audit_logs' })
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: true })
  userId?: number;

  @Column({ type: 'varchar' })
  action: string;

  @Column({ type: 'varchar' })
  entity: string;

  @Column({ type: 'integer', nullable: true })
  entityId?: number;

  @Column({ type: 'text', nullable: true })
  details?: string;

  @Column({ type: 'varchar', nullable: true })
  ipAddress?: string;

  @Column({ type: 'varchar', nullable: true })
  userAgent?: string;

  @CreateDateColumn()
  createdAt: Date;
}