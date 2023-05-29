import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { ProductNotFoundException } from 'src/exceptions/product-notfound.exception';
import { PaginateOptions, paginate } from 'src/helpers/paginator.helper';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginatedProducts, Product } from './entities/product.entity';
import { CategoriesService } from '../categories/categories.service';
import { CategoryNotFoundException } from 'src/exceptions/category-notfound.exception';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoriesService,
  ) {}
  private async generateProductSlug(name: string) {
    const baseSlug = slugify(name, { lower: true });
    const count = await this.productRepository.count({
      where: {
        name,
      },
    });
    const slugCategory = `${baseSlug}-${count + 1}`;
    return slugCategory;
  }

  async create(createProductDto: CreateProductDto) {
    const slug = await this.generateProductSlug(createProductDto.name);
    const category = await this.categoryService.findOne(
      createProductDto.categoryId,
    );
    if (!category) {
      throw new CategoryNotFoundException();
    }
    return await this.productRepository.save(
      new Product({
        ...createProductDto,
        slug,
        category,
        categoryId: 1,
      }),
    );
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });
    if (!product) {
      throw new ProductNotFoundException();
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const selectedProduct = await this.getProductById(id);
    if (!selectedProduct) {
      throw new ProductNotFoundException();
    }
    if (selectedProduct.name != updateProductDto.name) {
      selectedProduct.slug = await this.generateProductSlug(
        updateProductDto.name,
      );
    }
    return await this.productRepository.save(
      new Product({
        ...selectedProduct,
        ...updateProductDto,
      }),
    );
  }

  async remove(id: number): Promise<DeleteResult> {
    const product = await this.getProductById(id);
    if (!product) {
      throw new ProductNotFoundException();
    }

    return await this.productRepository.delete(product.id);
  }

  private getProductsBaseQuery(): SelectQueryBuilder<Product> {
    return this.productRepository
      .createQueryBuilder('p')
      .orderBy('p.created_at', 'DESC');
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return await this.productRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getAllProductsPaginated(
    paginateOptions: PaginateOptions,
  ): Promise<PaginatedProducts> {
    return await paginate(
      this.getAllProductsWithCategoryQuery(),
      paginateOptions,
    );
  }

  getAllProductsWithCategoryQuery() {
    return this.getProductsBaseQuery()
      .leftJoinAndSelect('p.category', 'c')
      .where('c.id = p.categoryId');
  }
}
