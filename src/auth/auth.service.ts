import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { RegisterDTO, LoginDTO } from 'src/models/user.dto';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async login({ email, password }: LoginDTO) {
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
      const isValid = await user.comparePassowrd(password);
      if (!isValid) {
        throw new UnauthorizedException('Email Veya Şifreniz Yanlış.!!');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Email Veya Şifreniz Yanlış.!!');
    }
  }

  async register(credentials: RegisterDTO) {
    try {
      const user = await this.userRepository.create(credentials);
      await user.save();
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Bu kullanıcı adı daha önce alınmıştır.');
      }
      throw new InternalServerErrorException();
    }
  }
}
