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
  ArticleResponse,
  CreateArticleBody,
  UpdateArticleBody,
} from 'src/models/article.model';
import { OptionalAuthGuard } from 'src/auth/optional-auth-guard';
import { CommentsService } from './comments.service';
import { ResponseObject } from 'src/models/response.model';
import { ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiCreatedResponse, ApiBody } from '@nestjs/swagger';
import { CreateCommentBody } from 'src/models/comment.model';

@Controller('articles')
export class ArticleController {
  constructor(
    private articleService: ArticleService,
    private commentService: CommentsService,
  ) {}

  @ApiOkResponse({ description: 'List all articles' })
  @Get()
  @UseGuards(new OptionalAuthGuard())
  async findAll(
    @User() user: UserEntity,
    @Query() query: FindAllQuery,
  ): Promise<
  ResponseObject<'articles',ArticleResponse[]>&
  ResponseObject<'articlesCount',number>
     > {
    const articles = await this.articleService.findAll(user, query);
    return { articles, articlesCount: articles.length };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'List all articles of users feed' })
  @ApiUnauthorizedResponse()
  @Get('/feed')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async findFeed(@User() user: UserEntity, @Query() query: FindFeedQuery) {
    const articles = await this.articleService.findFeed(user, query);
    return { articles, articlesCount: articles.length };
  }

  @ApiOkResponse({ description: 'Article with slug :slug' })
  @Get('/:slug')
  @UseGuards(new OptionalAuthGuard())
  async findBySlug(@Param('slug') slug: string, @User() user: UserEntity) {
    const article = await this.articleService.findBySlug(slug);
    return article.toArticle(user);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Create article' })
  @ApiUnauthorizedResponse()
  @ApiBody({ type: CreateArticleBody })
  @Post()
  @UseGuards(AuthGuard())
  async createArticle(
    @User() user: UserEntity,
    @Body('article', ValidationPipe) data: CreateArticleDTO,
  ) {
    const article = await this.articleService.createArticle(user, data);
    return { article };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Update article' })
  @ApiUnauthorizedResponse()
  @ApiBody({ type: UpdateArticleBody })
  @Put('/:slug')
  @UseGuards(AuthGuard())
  async updateArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity,
    @Body('article', ValidationPipe) data: UpdateArticleDTO,
  ) {
    const article = await this.articleService.updateArticle(slug, user, data);
    return { article };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete article' })
  @ApiUnauthorizedResponse()
  @Delete('/:slug')
  @UseGuards(AuthGuard())
  async deleteArticle(@Param('slug') slug: string, @User() user: UserEntity) {
    const article = await this.articleService.deleteArticle(slug, user);
    return { article };
  }

  @ApiOkResponse({ description: 'List article comments' })
  @Get('/:slug/comments')
  async findComments(@Param('slug') slug: string) {
    const comment = await this.commentService.findByArticleSlug(slug);
    return { comment };
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Create new comment' })
  @ApiUnauthorizedResponse()
  @ApiBody({ type: CreateCommentBody })
  @Post('/:slug/comments')
  @UseGuards(AuthGuard())
  async createComment(
    @User() user: UserEntity,
    @Body('comment', ValidationPipe) data: CreateArticleDTO,
  ) {
    const comment = await this.commentService.createComment(user, data);
    return { comment };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete comment' })
  @ApiUnauthorizedResponse()
  @Delete('/:slug/comments/:id')
  @UseGuards(AuthGuard())
  async deleteComment(@User() user: UserEntity, @Param('id') id: number) {
    const comment = await this.commentService.deleteComment(user, id);
    return { comment };
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Favorite article' })
  @ApiUnauthorizedResponse()
  @Post('/:slug/favorite')
  @UseGuards(AuthGuard())
  async favoriteArticle(@Param('slug') slug: string, @User() user: UserEntity) {
    const article = await this.articleService.favoriteArticle(slug, user);
    return { article };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Unfavorite article' })
  @ApiUnauthorizedResponse()
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
