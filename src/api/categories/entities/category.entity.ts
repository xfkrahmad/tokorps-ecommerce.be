import { Expose } from 'class-transformer';
import { Product } from 'src/api/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category {
  constructor(partial: Partial<Category>) {
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

  @OneToMany(() => Product, (product) => product.category, {
    cascade: true,
  })
  @Expose()
  products: Product[];
}
