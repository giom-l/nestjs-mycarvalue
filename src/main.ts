import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Done the old way because of conflict with tsconfig
//const cookieSession = require('cookie-session');
// Otherwise, it needs to have esModuleInterop set to true in tsconfig.j
// import cookieSession from 'cookie-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // One simple solution to use this setup in e2e testing could be to externalize this setup and also call it in e2e test.
  // Or set them up in AppModule
  // app.use(
  //   cookieSession({
  //     keys: ['whateveryouwant'],
  //   }),
  // );
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   }),
  // );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
