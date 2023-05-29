import { Length } from 'class-validator';

export class CreateProductDto {
  @Length(5)
  name: string;
  @Length(5)
  description: string;
  @Length(1)
  categoryId: number;
}
