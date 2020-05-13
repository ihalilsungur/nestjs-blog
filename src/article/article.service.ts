import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import {
  CreateArticleDTO,
  UpdateArticleDTO,
  FindAllQuery,
  FindFeedQuery,
} from 'src/models/article.model';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private userReposiyory: Repository<UserEntity>,
  ) {}

  async findAll(user: UserEntity, query: FindAllQuery) {
    // eslint-disable-next-line prefer-const
    let findOptions : any = {
      where: {},
    };

    if (query.author) {
      findOptions.where['author.username'] = query.author;
    }

    if (query.favorited) {
      findOptions.where['favoritedBy.username'] = query.favorited;
    }

    if (query.tag) {
      findOptions.where.tagList = Like(`%${query.tag}%`);
    }

    if (query.offset) {
      findOptions.offset = query.offset;
    }
    if (query.limit) {
      findOptions.limit = query.limit;
    }
    const findArticleOptins = await this.articleRepository.find(findOptions);
    return findArticleOptins.map(article => article.toArticle(user));
  }

  async findFeed(user: UserEntity, query: FindFeedQuery) {
    const { followee } = await this.userReposiyory.findOne({
      where: { id: user.id },
      relations: ['followee'],
    });

    const findOptions = {
      ...query,
      where: followee.map(follow => ({ author: follow.id })),
    };
    const findArticleOptins = await this.articleRepository.find(findOptions);
    return findArticleOptins.map(article => article.toArticle(user));
  }

  findBySlug(slug: string) {
    return this.articleRepository.findOne({ where: { slug } });
  }

  /**
   * article yani makelenin üzerinde yapılcak her hangi bir değişiklikte
   * yapanın makalenin sahibi mi değil mi kontrol etmek
   * ve bu göre izin vermek gerekir.
   */
  private ensureOwnership(user: UserEntity, article: ArticleEntity): boolean {
    return user.id === article.author.id;
  }

  async createArticle(user: UserEntity, data: CreateArticleDTO) {
    const article = await this.articleRepository.create(data);
    article.author = user;
    const { slug } = await article.save();
    return (await this.articleRepository.findOne({ slug })).toArticle(user);
  }

  async updateArticle(slug: string, user: UserEntity, data: UpdateArticleDTO) {
    const article = await this.findBySlug(slug);
    const ownership = this.ensureOwnership(user, article);
    if (!ownership) {
      throw new UnauthorizedException();
    }
    await this.articleRepository.update({ slug }, data);
    return article.toArticle(user);
  }

  async deleteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    const ownership = this.ensureOwnership(user, article);
    if (!ownership) {
      throw new UnauthorizedException();
    }
    await this.articleRepository.remove(article);
  }

  async favoriteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    article.favoritedBy.push(user);
    await article.save();
    return (await this.findBySlug(slug)).toArticle(user);
  }

  async unfavoriteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    article.favoritedBy = article.favoritedBy.filter(fav => fav.id !== user.id);
    await article.save();
    return (await this.findBySlug(slug)).toArticle(user);
  }
}
