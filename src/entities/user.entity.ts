import { AbstractEntity } from './abstract.entity';
import { Entity, Column, BeforeInsert, JoinTable, ManyToMany, OneToMany, JoinColumn } from 'typeorm';
import { IsEmail } from "class-validator"
import { Exclude, classToPlain } from "class-transformer"
import * as bcrypt from 'bcryptjs'
import { ArticleEntity } from './article-entity';



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

  
  @ManyToMany(() => UserEntity, user => user.following)
  @JoinTable()
  followers : UserEntity[];


  @ManyToMany(() => UserEntity, user => user.followers)
  @JoinTable()
  following : UserEntity[];

   @ManyToMany(
     ()=>ArticleEntity,
     arcticle => arcticle.favoritedBy
   )
   @JoinColumn()
   favorites : ArticleEntity[];


   @OneToMany(
     () => ArticleEntity,
     article => article.author
   )
   articles :ArticleEntity[];


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

  toProfile(user:UserEntity){
    const following  = this.followers.includes(user);
    const profile :any =this.toJSON();
    delete profile.followers;
    return {...profile,following}; 
  }
 
}
