import { DataSource, DataSourceOptions } from 'typeorm';

export const appDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  entities: ['**/*.entity{.js,.ts}'],
  migrations: ['**/migrations/*{.js,.ts}'],
} as DataSourceOptions);
