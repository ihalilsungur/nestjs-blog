import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from 'src/models/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UsePipes(ValidationPipe)
  /**
   * ValidationPipe ile 
   * user.DTO.ts dosyasının içindeki propertilerde belirtiğimiz kurallar 
   * gelen nesnenin propertilerinin uyup uymadığını kontrol ediyoruz.
   */
  userLogin(@Body() credentials:LoginDTO) {
    return this.authService.login(credentials);
  }

  @Post('/user')
  @UsePipes(ValidationPipe)
  userRegister(@Body() credentials:RegisterDTO) {
    return this.authService.register(credentials);
  }
}
