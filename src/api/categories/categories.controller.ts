import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  MSG_CATEGORY_CREATE_SUCCESS,
  MSG_CATEGORY_FETCH_ALL_SUCCESS,
  MSG_CATEGORY_UPDATE_SUCCESS,
} from 'src/constants/category-response.constant';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuardJwt } from 'src/guards/auth-guard.jwt';
import { RolesGuard } from 'src/guards/user-roles.guard';
import { Roles } from '../users/roles.decorator';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@SerializeOptions({ strategy: 'excludeAll' })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ResponseMessage(MSG_CATEGORY_CREATE_SUCCESS)
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Role.Admin)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ResponseMessage(MSG_CATEGORY_FETCH_ALL_SUCCESS)
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage(MSG_CATEGORY_UPDATE_SUCCESS)
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Role.Admin)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
