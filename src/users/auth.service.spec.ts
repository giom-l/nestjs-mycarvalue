import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    // create a fake copy of UsersService (to pass dependency injection)
    fakeUsersService = {
      // Those simple versions works with first tests with no issue but require some complex setup for signin check
      // find: () => Promise.resolve(users),
      // create: (email: string, password: string) =>
      //   Promise.resolve({ id: 1, email, password } as User),

      // New version is slightly more complex in setup but let us signup users then signin against the newly created users.
      // this is way more simple to use.
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        // following will make use of the fake dependency and allow the authService to be instanciated.
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const provided_email = 'test@bla.com';
    const provided_password = 'clear_password';
    const user = await service.signup(provided_email, provided_password);
    expect(user.password).not.toEqual(provided_password);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws a BadRequestException if user signs up with email that is already in use', async () => {
    const provided_email = 'test@bla.com';
    const provided_password = 'clear_password';

    // Not mandatory but indicates how many assertions are expected in this test.
    // Specifically useful in asynchronous testing.
    expect.assertions(1);

    // Change the fake service to make the email already exist
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     { id: 20, email: provided_email, password: provided_password } as User,
    //   ]);

    // alternative is to signup then retry to signup again with same email
    // Note this require our fake users to persist users temporarily (here is an array)
    await service.signup(provided_email, provided_password);
    await expect(
      service.signup(provided_email, provided_password),
    ).rejects.toThrow(BadRequestException);
    // try {
    //   await expect(
    //     service.signup(provided_email, provided_password),
    //   ).rejects.toThrow(BadRequestException);
    // } catch (err) {}
  });

  it('throws a NotFoundException if signin is called with a not existing email', async () => {
    const provided_email = 'test@bla.com';
    const provided_password = 'clear_password';

    await expect(
      service.signin(provided_email, provided_password),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws a UnauthorizedException if an invalid password is provided', async () => {
    const provided_email = 'test@bla.com';
    const provided_password = 'clear_password.salt';

    // Change the fake service to make the email already exist
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     { id: 20, email: provided_email, password: provided_password } as User,
    //   ]);

    // alternative is to signup then retry to signup again with same email
    // Note this require our fake users to persist users temporarily (here is an array)
    await service.signup(provided_email, provided_password);
    // No matter which email is provided here, the fake will always return the promise above
    await expect(service.signin(provided_email, 'whatever')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    const provided_email = 'test@bla.com';
    const provided_password = 'clear_password';

    await service.signup(provided_email, provided_password);
    const user = await service.signin(provided_email, provided_password);
    expect(user).toBeDefined();

    // One way could be to store a user we signup with, then try to sign in with it.

    // Another way is kind of a hack. We use the prototype to be able to access the private method.
    // const serviceProto = Object.getPrototypeOf(service);
    // const salt = 'salt';
    // const hashed_password = await serviceProto.getHashedPassword(
    //   provided_password,
    //   salt,
    // );

    // // Change the fake service to make the email already exist
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     { id: 20, email: provided_email, password: hashed_password } as User,
    //   ]);

    // const user = await service.signin(provided_email, provided_password);
    // expect(user).toBeDefined();
  });
});
