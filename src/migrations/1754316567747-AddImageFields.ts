import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageFields1754316567747 implements MigrationInterface {
    name = 'AddImageFields1754316567747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "profilePicture" text`);
        await queryRunner.query(`ALTER TABLE "cities" ADD "imageUrl" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profilePicture"`);
    }

}
