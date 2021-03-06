import { IsString } from "class-validator";
import { ProfileResponse } from "./user.model";
import { UserEntity } from "src/entities/user.entity";

export class CreateCommentDTO{
    @IsString()
    body;

}

export class CreateCommentBody {
   // @ApiProperty()
    comment: CreateCommentDTO;
  }
  
  export class CommentResponse {
    id: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    body: string;
    author: ProfileResponse | UserEntity;
  }

