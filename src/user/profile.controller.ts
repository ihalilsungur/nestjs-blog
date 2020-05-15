import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from 'src/entities/user.entity';
import { User } from 'src/auth/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('profile')
export class ProfileController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({ description: 'Find user profile' })
  @Get('/:username')
  async findProfile(@Param('username') username: string) {
    const profile = await this.userService.findByUsername(username);
    if (!profile) {
      throw new NotFoundException();
    }
    return { profile };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Follow user' })
  @ApiUnauthorizedResponse()
  @Post('/:username/follow')
  @UseGuards(AuthGuard())
  async followUser(
    @User() user: UserEntity,
    @Param('username') username: string,
  ) {
    const profile = await this.userService.followUser(user, username);
    return { profile };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Unfollow user' })
  @ApiUnauthorizedResponse()
  @Delete('/:username/follow')
  @UseGuards(AuthGuard())
  async unfollowUser(
    @User() user: UserEntity,
    @Param('username') username: string,
  ) {
    const profile = await this.userService.unfollowUser(user, username);
    return { profile };
  }
}
