import { Length } from 'class-validator';

export class CreateCategoryDto {
  @Length(5)
  name: string;
}
