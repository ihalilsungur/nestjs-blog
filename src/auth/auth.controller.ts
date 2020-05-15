import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO, AuthResponse } from 'src/models/user.model';
import { ResponseObject } from 'src/models/response.model';
import {  ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiBody } from '@nestjs/swagger';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @ApiCreatedResponse({description:'User Registration'})
  @UsePipes(ValidationPipe)
  @ApiBody({type:RegisterDTO})
  async userRegister(@Body('user', ValidationPipe) credentials: RegisterDTO) {
    const user = await this.authService.register(credentials);
    return { user };
  }

  @Post('/login')
  @ApiOkResponse({description:'User Login'})
  @ApiUnauthorizedResponse({description:'Invalid Credentails'})
  @UsePipes(ValidationPipe)
  @ApiBody({type:LoginDTO})
  /**
   * ValidationPipe ile
   * user.DTO.ts dosyasının içindeki propertilerde belirtiğimiz kurallar
   * gelen nesnenin propertilerinin uyup uymadığını kontrol ediyoruz.
   */
  async userLogin(
    @Body('user', ValidationPipe) credentials: LoginDTO,
  ): Promise<ResponseObject<'user', AuthResponse>> {
    const user = await this.authService.login(credentials);
    return {user} ;
  }
}
