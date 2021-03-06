/* eslint-disable @typescript-eslint/no-unused-vars */
import { AbstractEntity } from './abstract.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { classToPlain } from 'class-transformer';
import { ArticleEntity } from './article.entity';

@Entity('comments')
export class CommentEntity extends AbstractEntity {
  @Column()
  body: string;

  @ManyToOne(
    type => UserEntity,
    user => user.comments,
    { eager: true },
  )
  author: UserEntity;

  @ManyToOne(
    type => ArticleEntity,
    article => article.comments,
  )
  article: ArticleEntity;

  toJSON() {
    return classToPlain(this);
  }
}
