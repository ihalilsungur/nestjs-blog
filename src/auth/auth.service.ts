import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import {
  RegisterDTO,
  LoginDTO,
  UpdateUserDTO,
  AuthResponse,
} from 'src/models/user.model';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDTO): Promise<AuthResponse> {
    try {
      /**
       * ilk olarak gelen kullanıcıyı veritabanında sorguluyoruz.
       * eğer kullanıcı varda bunu user atıyoruz.
       * daha sonra ise user.comparePassword metoduyla
       * Gelen şifre ile veritabanında bulunan user şifre biribirine uyuyor ise
       * sistem girişine izin veriyoruz.
       * Değil ise bir tana throw firlatiyoruz.
       */
      const user = await this.userRepository.findOne({ where: { email } });
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        throw new UnauthorizedException('Email Veya Şifreniz Yanlış.!!');
      }
      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);
      return { ...user.toJSON(), token };
    } catch (error) {
      throw new UnauthorizedException('Email Veya Şifreniz Yanlış.!!');
    }
  }

  async register(credentials: RegisterDTO) {
    try {
      const user = await this.userRepository.create(credentials);
      await user.save();
      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);
      return { ...user.toJSON(), token };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Bu kullanıcı adı daha önce alınmıştır.');
      }
      throw new InternalServerErrorException();
    }
  }

  async updateUser(
    username: string,
    data: UpdateUserDTO,
  ): Promise<AuthResponse> {
    await this.userRepository.update({ username }, data);
    const user = await this.userRepository.findOne({ where: { username } });
    const payload = { username };
    const token = this.jwtService.sign(payload);
    return { ...user.toJSON(), token };
  }
}
