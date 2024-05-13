import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
// Not needed anymore since we defined autoload entities in typeorm.config.ts
// import { User } from './users/user.entity';
// import { Report } from './reports/report.entity';
import cookieSession from 'cookie-session';
import { TypeOrmConfigService } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      // Working but changed in favor of loading the connection through typeorm.config.ts
      // inject: [ConfigService],
      // useFactory: (config: ConfigService) => {
      //   return {
      //     type: 'sqlite',
      //     database: config.get<string>('DB_NAME'),
      //     entities: [User, Report],
      //     synchronize: true, // keep DB in sync with entities
      //   };
      // },
    }),
    // Refactored to be able to use ConfigService depedency injection
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   // to variabilize the db used, we could use a simple
    //   // database: process.env.NODE_ENV === "test" ? 'test-db.sqlite' : 'db.sqlite'
    //   // But nest recommends having a ConfigService for that (way more complicated), handled by @nestjs/config
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
