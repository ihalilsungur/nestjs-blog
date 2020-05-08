import { PassportStrategy } from '@nestjs/passport';
import { UserEntity } from 'src/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthPayload } from 'src/models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Token'),
      secretOrKey: process.env.SECRET,
    });
  }

  async validate(payload: AuthPayload) {
    const { username } = payload;
    const user = this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
