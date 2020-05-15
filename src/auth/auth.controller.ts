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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/user')
  @UsePipes(ValidationPipe)
  async userRegister(@Body('user', ValidationPipe) credentials: RegisterDTO) {
    const user = await this.authService.register(credentials);
    return { user };
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
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
