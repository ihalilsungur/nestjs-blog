import { AbstractEntity } from './abstract.entity';
import { Entity, Column, BeforeInsert } from 'typeorm';
import { IsEmail } from "class-validator"
import { Exclude, classToPlain } from "class-transformer"
import * as bcrypt from 'bcryptjs'


@Entity('users')
export class UserEntity extends AbstractEntity {
 

  @Column()
  @IsEmail()
  email: string;

  @Column({unique:true})
  username: string;

  @Column()
  @Exclude()//password kullanıcıya geri göndermiyoruz.
  password:string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: null, nullable: true })
  image: string | null;

  /**Gelen passwordu veritabanına eklemeden 
   * önce password'u  şifreye donusturuyoruz ve ondan sonra kaydediyoruz.
   * */
  @BeforeInsert()
  async hashPassword(){
      this.password = await bcrypt.hash(this.password,10);
  }

  /**
   * Gelen password ile veritabanında olan password karşılaştırılıyoruz
   * Sonuç dogru mu değil mi ? diye kotrol ediyoruz.!
   * @param attempt 
   */
 async comparePassowrd(attempt:string) {
    return await bcrypt.compare(attempt,this.password);
   }

  toJSON(){
      return classToPlain(this);
  }

 
}
