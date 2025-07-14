import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCountryToCity1752522396178 implements MigrationInterface {
    name = 'AddCountryToCity1752522396178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cities" ADD "country" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "country"`);
    }

}
