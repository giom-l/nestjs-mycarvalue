import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitialSchema1715533761493 implements MigrationInterface {
  name = 'InitialSchema1715533761493';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Auto generated migrations but which wont work with postgres in production
    // await queryRunner.query(
    //   `CREATE TABLE "report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "lat" integer NOT NULL, "lng" integer NOT NULL, "mileage" integer NOT NULL, "user_id" integer)`,
    // );
    // await queryRunner.query(
    //   `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "admin" boolean NOT NULL DEFAULT (0))`,
    // );
    // await queryRunner.query(
    //   `CREATE TABLE "temporary_report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "lat" integer NOT NULL, "lng" integer NOT NULL, "mileage" integer NOT NULL, "user_id" integer, CONSTRAINT "FK_c6686efa4cd49fa9a429f01bac8" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    // );
    // await queryRunner.query(
    //   `INSERT INTO "temporary_report"("id", "approved", "price", "make", "model", "year", "lat", "lng", "mileage", "user_id") SELECT "id", "approved", "price", "make", "model", "year", "lat", "lng", "mileage", "user_id" FROM "report"`,
    // );
    // await queryRunner.query(`DROP TABLE "report"`);
    // await queryRunner.query(
    //   `ALTER TABLE "temporary_report" RENAME TO "report"`,
    // );
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'admin',
            type: 'boolean',
            default: 'true',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'report',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'approved', type: 'boolean', default: 'false' },
          { name: 'price', type: 'float' },
          { name: 'make', type: 'varchar' },
          { name: 'model', type: 'varchar' },
          { name: 'year', type: 'integer' },
          { name: 'lng', type: 'float' },
          { name: 'lat', type: 'float' },
          { name: 'mileage', type: 'integer' },
          { name: 'userId', type: 'integer' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   `ALTER TABLE "report" RENAME TO "temporary_report"`,
    // );
    // await queryRunner.query(
    //   `CREATE TABLE "report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "lat" integer NOT NULL, "lng" integer NOT NULL, "mileage" integer NOT NULL, "user_id" integer)`,
    // );
    // await queryRunner.query(
    //   `INSERT INTO "report"("id", "approved", "price", "make", "model", "year", "lat", "lng", "mileage", "user_id") SELECT "id", "approved", "price", "make", "model", "year", "lat", "lng", "mileage", "user_id" FROM "temporary_report"`,
    // );
    // await queryRunner.query(`DROP TABLE "temporary_report"`);
    // await queryRunner.query(`DROP TABLE "user"`);
    // await queryRunner.query(`DROP TABLE "report"`);
    await queryRunner.query(`DROP TABLE ""report""`);
    await queryRunner.query(`DROP TABLE ""user""`);
  }
}
