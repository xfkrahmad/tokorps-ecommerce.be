import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { CategoryNotFoundException } from 'src/exceptions/category-notfound.exception';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryRepository.save(
      new Category({
        ...createCategoryDto,
        slug: await this.generateCategorySlug(createCategoryDto.name),
      }),
    );
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.getCategoryById(id);
    if (!category) {
      throw new CategoryNotFoundException();
    }
    return await this.categoryRepository.save(
      new Category({
        ...category,
        ...updateCategoryDto,
        slug: await this.generateCategorySlug(updateCategoryDto.name),
      }),
    );
  }

  async remove(id: number) {
    const category = await this.getCategoryById(id);
    if (!category) {
      throw new CategoryNotFoundException();
    }
    return await this.categoryRepository.remove(category);
  }

  private async generateCategorySlug(name: string) {
    const baseSlug = slugify(name, { lower: true });
    const count = await this.categoryRepository.count({
      where: {
        name,
      },
    });
    const slugCategory = `${baseSlug}-${count + 1}`;
    return slugCategory;
  }

  async getCategoryById(id: number) {
    return await this.categoryRepository.findOne({ where: { id } });
  }
}
