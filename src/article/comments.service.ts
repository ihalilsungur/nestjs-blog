import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { CreateCommentDTO } from 'src/models/comment.model';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  async findByArticleSlug(slug: string) {
    return await this.commentRepository.find({
      where: { 'article.slug': slug },
      relations: ['article'],
    });
  }
  async findById(id: number) {
    return await this.commentRepository.findOne({ where: { id } });
  }
  async createComment(user: UserEntity, data: CreateCommentDTO) {
    const comment = this.commentRepository.create(data);
    comment.author = user;
    await comment.save();
    return this.commentRepository.findOne({ where: { body: data.body } });
  }

  async deleteComment(user: UserEntity, id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id, 'author.id': user.id },
    });
    await comment.remove();
    return comment;
  }
}
