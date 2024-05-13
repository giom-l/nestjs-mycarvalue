import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const migrationsRun = JSON.parse(
      this.configService.get<string>('MIGRATIONS_RUN', 'false'),
    );
    const options = {
      type: this.configService.get<any>('DB_TYPE'),
      synchronize: JSON.parse(
        this.configService.get<string>('DB_SYNCHRONIZE', 'false'),
      ),
      database: this.configService.get<string>('DB_NAME'),
      autoLoadEntities: true,
      migrationsRun: migrationsRun,
      //   migrations: migrationsRun ? ['src/migrations/*{.js,.ts}'] : null,
    };

    if (process.env.NODE_ENV === 'production') {
      Object.assign(options, {
        url: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: JSON.parse(
            this.configService.get<string>('SSL_REJECT_UNAUTH'),
          ),
        },
      });
    }

    console.log(`Using db options : ${JSON.stringify(options)}`);
    return options;
  }
}
