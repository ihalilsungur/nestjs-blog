import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, MinLength, IsNotEmpty, IsOptional } from 'class-validator'


export class LoginDTO{
    @IsString()
    @IsEmail()
    @MinLength(4)
    @IsNotEmpty()
    @ApiProperty({type:String,description:'email'})
    email:string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    @ApiProperty({type:String,description:'password'})
    password:string;
}

export class RegisterDTO extends LoginDTO{
    @IsString()
    @MinLength(2)
    @ApiProperty({type:String,description:'username'})
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

export class UpdateUserBody {
  @ApiProperty()
  user: UpdateUserDTO;
}

  export interface UserResponse {
    email: string;
    username?: string;
    bio: string;
    image: string | null;
  }
  
  export interface AuthResponse extends UserResponse {
    token: string;
  }
  
  export interface ProfileResponse extends UserResponse {
    following: boolean | null;
  }