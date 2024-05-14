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
      autoLoadEntities: true,
      migrationsRun: migrationsRun,
    };

    // Specify migrations field for e2e testing otherwise it does not find it.
    // Not sure why...
    if (process.env.NODE_ENV === 'test' && migrationsRun) {
      Object.assign(options, {
        migrations: ['src/migrations/*{.ts,.js}'],
      });
    }

    // Add specifics for production (here heroku)
    if (process.env.NODE_ENV === 'production') {
      Object.assign(options, {
        url: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: JSON.parse(
            this.configService.get<string>('SSL_REJECT_UNAUTH'),
          ),
        },
      });
    } else {
      // If not production (hence no url, just use the database name)
      // It won't work in all combination for it work for this learning project
      Object.assign(options, {
        database: this.configService.get<string>('DB_NAME'),
      });
    }

    console.log(`Using db options : ${JSON.stringify(options)}`);
    return options;
  }
}
