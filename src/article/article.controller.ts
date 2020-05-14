import {
  Controller,
  Get,
  Param,
  Body,
  ValidationPipe,
  Post,
  UseGuards,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateArticleDTO,
  UpdateArticleDTO,
  FindFeedQuery,
  FindAllQuery,
} from 'src/models/article.model';
import { OptionalAuthGuard } from 'src/auth/optional-auth-guard';
import { CommentsService } from './comments.service';

@Controller('articles')
export class ArticleController {
  constructor(
    private articleService: ArticleService,
    private commentService: CommentsService,
  ) {}

  @Get()
  @UseGuards(new OptionalAuthGuard())
  async findAll(@User() user: UserEntity, @Query() query: FindAllQuery) {
    const articles = await this.articleService.findAll(user, query);
    return { articles, articlesCount: articles.length };
  }

  @Get('/feed')
  @UseGuards(AuthGuard())
  async findFeed(@User() user: UserEntity, @Query() query: FindFeedQuery) {
    const articles = await this.articleService.findFeed(user, query);
    return { articles, articlesCount: articles.length };
  }

  @Get('/:slug')
  @UseGuards(new OptionalAuthGuard())
  async findBySlug(@Param('slug') slug: string, @User() user: UserEntity) {
    const article = await this.articleService.findBySlug(slug);
    return article.toArticle(user);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createArticle(
    @User() user: UserEntity,
    @Body(ValidationPipe) data: { article: CreateArticleDTO },
  ) {
    const article = await this.articleService.createArticle(user, data.article);
    return { article };
  }

  @Put('/:slug')
  @UseGuards(AuthGuard())
  async updateArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity,
    @Body(ValidationPipe) data: { article: UpdateArticleDTO },
  ) {
    const article = await this.articleService.updateArticle(
      slug,
      user,
      data.article,
    );
    return { article };
  }

  @Delete('/:slug')
  @UseGuards(AuthGuard())
  async deleteArticle(@Param('slug') slug: string, @User() user: UserEntity) {
    const article = await this.articleService.deleteArticle(slug, user);
    return { article };
  }

  @Get('/:slug/comments')
  async findComments(@Param('slug') slug: string) {
    const comment = await this.commentService.findByArticleSlug(slug);
    return { comment };
  }

  @Post('/:slug/comments')
  @UseGuards(AuthGuard())
  async createComment(
    @User() user: UserEntity,
    @Body(ValidationPipe) data: { comment: CreateArticleDTO },
  ) {
    const comment = await this.commentService.createComment(user, data.comment);
    return { comment };
  }

  @Delete('/:slug/comments/:id')
  @UseGuards(AuthGuard())
  async deleteComment(@User() user: UserEntity, @Param('id') id: number) {
    const comment = await this.commentService.deleteComment(user, id);
    return { comment };
  }

  @Post('/:slug/favorite')
  @UseGuards(AuthGuard())
  async favoriteArticle(@Param('slug') slug: string, @User() user: UserEntity) {
    const article = await this.articleService.favoriteArticle(slug, user);
    return { article };
  }

  @Delete('/:slug/favorite')
  @UseGuards(AuthGuard())
  async unfavoriteArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ) {
    const article = await this.articleService.unfavoriteArticle(slug, user);
    return { article };
  }
}
