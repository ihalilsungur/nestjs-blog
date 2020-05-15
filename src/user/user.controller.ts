import {
  Controller,
  Get,
  UseGuards,
  Body,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/auth/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDTO, UpdateUserBody } from 'src/models/user.model';
import { ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiBody } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Current user' })
  @ApiUnauthorizedResponse()
  @Get()
  @UseGuards(AuthGuard())
  findCurrentUser(@User() { username }: UserEntity) {
    return this.userService.findByUsername(username);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Update current user' })
  @ApiUnauthorizedResponse()
  @ApiBody({ type: UpdateUserBody })
  @Put()
  @UseGuards(AuthGuard())
  update(
    @User() { username }: UserEntity,
    @Body('user',new ValidationPipe({ transform: true, whitelist: true }))
    data: UpdateUserDTO,
  ) {
    return this.userService.updateUser(username, data);
  }
}
