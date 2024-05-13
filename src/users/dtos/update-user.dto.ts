import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

// Above is equivalent to
// import { IsString, IsEmail, IsOptional } from 'class-validator';
// export class UpdateUserDto {
//   @IsEmail()
//   @IsOptional()
//   email: string;
//   @IsString()
//   @IsOptional()
//   password: string;
// }
