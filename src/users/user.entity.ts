import {
  Entity,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { Report } from '../reports/report.entity';
// Just using exclude works. But it'll become complicated to serve the same entity as multiple purposes like having multiple routes
// that should return different fields of the same entity.
// For that purpose, it would be better to have a custom interceptor that uses some particular DTO to describe what needs to be returned for each route.
// import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  // @Exclude()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log(`[Entity] Inserted user with id ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`[Entity] Removed user with id ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`[Entity] Updated user with id ${this.id}`);
  }
}
