import {
  Entity,
  Column,
  BeforeInsert,
  ManyToOne,
  ManyToMany,
  JoinTable,
  RelationCount,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import * as slugify from 'slug';
import { UserEntity } from './user.entity';
import { classToPlain } from 'class-transformer';

@Entity('articles')
export class ArticleEntity extends AbstractEntity {
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @ManyToOne(
    () => UserEntity,
    user => user.articles,
    { eager: true },
  )
  author: UserEntity;

  @ManyToMany(
    () => UserEntity,
    user => user.articles,
    { eager: true },
  )
  @JoinTable()
  favoritedBy: UserEntity[];

  @RelationCount((article: ArticleEntity) => article.favoritedBy)
  favoritesCount: number;

  @Column('simple-array')
  tagList:string[];

  @BeforeInsert()
  generateSlug() {
    this.slug =
      slugify(this.title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  toJSON() {
    return classToPlain(this);
  }

  toArtcile(user: UserEntity) {
    let favorited = null;
    if (user) {
      favorited = this.favoritedBy.includes(user);
    }

    const article: any = this.toJSON();
    delete article.favoritedBy;
    return { ...article, favorited };
  }
}
