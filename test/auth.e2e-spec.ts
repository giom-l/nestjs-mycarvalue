import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
// import { cleanDB } from './cleanTestDb';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  // Here we would clean the db after the test suite.
  // Currently we're using a global beforeEach to clean the db between each test, defined in jest-e2e.json
  // We could also import and use cleanDB() in below before each, which would be clearer IMO
  //   afterAll(async () => {
  //     await cleanDB();
  //   });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a singup request', () => {
    const provided_email = 'test@whatever.com';
    const provided_password = 'password';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: provided_email, password: provided_password })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(provided_email);
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const provided_email = 'test@whatever.com';
    const provided_password = 'password';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: provided_email, password: provided_password })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(provided_email);
  });
});
