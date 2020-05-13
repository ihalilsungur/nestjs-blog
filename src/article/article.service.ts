import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDTO, UpdateArticleDTO } from 'src/models/article.model';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private userReposiyory: Repository<UserEntity>,
  ) {}

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
}
