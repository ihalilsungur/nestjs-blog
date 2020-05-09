
import { IsString, IsEmail, MinLength, IsNotEmpty, IsOptional } from 'class-validator'

export class LoginDTO{
    @IsString()
    @IsEmail()
    @MinLength(4)
    @IsNotEmpty()
    email:string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    password:string;
}

export class RegisterDTO extends LoginDTO{
    @IsString()
    @MinLength(2)
    username:string;
}

export class UpdateUserDTO {
    @IsEmail()
    @IsOptional()
    email :string;

    @IsOptional()
    image :string;

    @IsOptional()
    bio :string;
}

export interface AuthPayload {
    username: string;
  }