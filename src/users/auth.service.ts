import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
// promisify will handle the promise for scrypt. Otherwise, we would have to handle it with callbacks
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const existing_users = await this.usersService.find(email);
    if (existing_users.length) {
      throw new BadRequestException('[AuthService] Email already existing');
    }
    // Generate a salt
    const salt = randomBytes(10).toString('hex');
    // Hash the password
    const hashedPassword = await this.getHashedPassword(password, salt);
    // Create a new user and store it into our database
    const user = await this.usersService.create(email, hashedPassword);
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException(
        '[AuthService] No user found with this email',
      );
    }
    const userPassword = user.password;
    const salt = userPassword.split('.')[1];
    const checkPassword = await this.getHashedPassword(password, salt);
    if (checkPassword !== userPassword) {
      throw new UnauthorizedException('Bad password provided');
    }
    return user;
  }

  private async getHashedPassword(password, salt) {
    // Hash the sale and the password together
    // 32 is the number of characters to return
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // Join the hash and the salt together
    const hashedPassword = hash.toString('hex') + '.' + salt;
    return hashedPassword;
  }
}
