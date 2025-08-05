import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailVerificationAndAuditLog1754419133272 implements MigrationInterface {
    name = 'AddEmailVerificationAndAuditLog1754419133272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add email verification fields to users table
        await queryRunner.query(`ALTER TABLE "users" ADD "isEmailVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "emailVerificationToken" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "emailVerificationTokenExpires" TIMESTAMP`);
        
        // Create audit_logs table
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" SERIAL NOT NULL, "userId" integer, "action" character varying NOT NULL, "entity" character varying NOT NULL, "entityId" integer, "details" text, "ipAddress" character varying, "userAgent" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop audit_logs table
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        
        // Remove email verification fields from users table
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emailVerificationTokenExpires"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emailVerificationToken"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isEmailVerified"`);
    }

}
