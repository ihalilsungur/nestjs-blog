/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Entity,
  Column,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude, classToPlain } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { AbstractEntity } from './abstract.entity';
import { ArticleEntity } from './article.entity';
import { CommentEntity } from './comment.entity';



@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column()
  @IsEmail()
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: null, nullable: true })
  image: string | null;

  @Column()
  @Exclude()
  password: string;

  @ManyToMany(
    type => UserEntity,
    user => user.followee,
  )
  @JoinTable()
  followers: UserEntity[];

  @ManyToMany(
    type => UserEntity,
    user => user.followers,
  )
  followee: UserEntity[];

  @OneToMany(
    type => ArticleEntity,
    article => article.author,
  )
  articles: ArticleEntity[];

  @OneToMany(
    type => CommentEntity,
    comment => comment.author,
  )
  comments: CommentEntity[];

  

  @ManyToMany(
    type => ArticleEntity,
    article => article.favoritedBy,
  )
  favorites: ArticleEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
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
