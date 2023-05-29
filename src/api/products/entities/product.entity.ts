import { Expose } from 'class-transformer';
import { Category } from 'src/api/categories/entities/category.entity';
import { PaginationResult } from 'src/helpers/paginator.helper';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ type: 'text', nullable: true })
  @Expose()
  slug: string;

  @Column({ type: 'text', nullable: true })
  @Expose()
  name: string;

  @Column()
  @Expose()
  description: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Expose()
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Expose()
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  @Expose()
  category: Category;

  @Column({ name: 'category_id' })
  @Expose()
  categoryId: number;
}

export type PaginatedProducts = PaginationResult<Product>;
