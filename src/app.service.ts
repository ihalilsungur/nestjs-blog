import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TagEntity } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(TagEntity)
    private tagRepository:Repository<TagEntity>
  ){}
  getHello(): string {
    return 'Hello World! nestjs-blog projesi';
  }

  findTags(){
    return this.tagRepository.find();
  }
}
