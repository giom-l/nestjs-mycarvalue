import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeAuthService = {
      signup: async (email: string, password: string) => {
        const user = await fakeUsersService.create(email, password);
        return Promise.resolve(user);
      },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    fakeUsersService = {
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
      findOne: (id: number) => {
        const filteredUser = users.filter((user) => user.id === id)[0];
        return Promise.resolve(filteredUser);
      },
      remove: (id: number) => {
        return Promise.resolve({
          id,
          email: 'whatever',
          password: 'whatever',
        } as User);
      },
      update: (id: number) => {
        return Promise.resolve({
          id,
          email: 'whatever',
          password: 'whatever',
        } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw a NotFoundException when looking for one user that does not exist', async () => {
    // if we don't handle some sort of state in our tests, we can just override the findOne function to return null
    // fakeUsersService.findOne = () => null;

    await expect(controller.findUser('9999')).rejects.toThrow(
      NotFoundException,
    );
  });
  it('should returns all users that match an email', async () => {
    //First create 2 users
    const search_email = 'test@test.com';
    await fakeAuthService.signup(search_email, 'password');
    await fakeAuthService.signup('test2@test.com', 'password');

    const foundUsers = await controller.findAllUsers(search_email);
    expect(foundUsers).toBeDefined();
    expect(foundUsers).toHaveLength(1);
    expect(foundUsers[0].email).toEqual(search_email);
  });

  it('should return a single user when looking for a user with a given id', async () => {
    const provided_email = 'anyone@whatever.com';
    const { id } = await fakeAuthService.signup(provided_email, 'password');
    const found_users = await controller.findUser(id.toString());
    expect(found_users).toBeDefined();
    expect(found_users).toHaveProperty('email');
    expect(found_users).toHaveProperty('password');
    expect(found_users).toHaveProperty('id');
    expect(found_users.email).toEqual(provided_email);
  });

  it('should return a user and update session object when successfully signin-in', async () => {
    const session = { userId: -10 };
    const user = await controller.login(
      { email: 'whatever', password: 'whatever' },
      session,
    );

    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
    expect(session).toHaveProperty('userId');
    expect(session.userId).toEqual(1);
  });

  it('should empty session object when signin out', async () => {
    const session = { userId: -10 };
    await controller.login(
      { email: 'whatever', password: 'whatever' },
      session,
    );
    expect(session).toHaveProperty('userId');
    expect(session.userId).toEqual(1);

    await controller.signout(session);
    expect(session.userId).toBeNull();
  });
});
