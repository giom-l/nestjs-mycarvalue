import {
  Body,
  Controller,
  Delete,
  Param,
  Query,
  Patch,
  Post,
  Get,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';

import { User } from './user.entity';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';

// import { CurrentUserInterceptor } from './interceptors/current.user.interceptor';
import { Serialize } from '../interceptors/serialize.interceptor';

import { CurrentUser } from './decorators/current.user.decorator';

import { UsersService } from './users.service';
import { AuthService } from './auth.service';

import { AuthGuard } from '../guards/auth.guard';

@Serialize<UserDto>(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    console.log(`[UserController] Creating user with email ${body.email}`);
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async login(@Body() body: CreateUserDto, @Session() session: any) {
    console.log('[UserController] Login in...');
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    session.loggedIn = true;
    return user;
  }

  @Post('/signout')
  async signout(@Session() session: any) {
    console.log('[UserController] Signing out..');
    session.userId = null;
  }

  // To be used with @Exclude() on entity field
  // import {UseInterceptors, ClassSerializerInterceptor} from '@nestjs/common';
  // @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findUser(@Param('id') id: string) {
    console.log(`[UserController] Getting user with id ${id}`);
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException(
        `[UserController] No user found with id ${id}`,
      );
    }
    return user;
  }

  @Get('')
  findAllUsers(@Query('email') email: string) {
    console.log(`[UserController] Getting all users with email ${email}`);
    return this.usersService.find(email);
  }

  @Patch(':id')
  // Why not use Partial<CreateUserDto> ?
  // updateUser(@Param('id') id: number, @Body() body: Partial<CreateUserDto>) {
  // Because in that case, nestjs wouldn't care about decorators added on createUSerDto class.
  // We could, instead of typescript's Partial use PartialType provided by @nestjs/mapped-types
  // We could then create the class UpdateUserDto as : export class UpdateUserDto extends PartialType(CreateUserDto)
  // This makes all the fields optional, avoid code repetition and preserve potential decorators set on original class.
  // Let's do it
  updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    console.log(`[UserController] Updating user with id ${id}`);
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    console.log(`[UserController] Deleting user with id ${id}`);
    return this.usersService.remove(parseInt(id));
  }
}
