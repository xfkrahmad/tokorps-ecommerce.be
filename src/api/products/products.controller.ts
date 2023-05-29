import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/api/users/roles.decorator';
import {
  MSG_PRODUCT_CREATE_SUCCESS,
  MSG_PRODUCT_FETCH_ALL_SUCCESS,
  MSG_PRODUCT_GET_SUCCESS,
  MSG_PRODUCT_UPDATE_SUCCESS,
} from 'src/constants/product-response.contanst';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuardJwt } from 'src/guards/auth-guard.jwt';
import { RolesGuard } from 'src/guards/user-roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProducts } from './dto/product-list.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
@Controller('products')
@SerializeOptions({ strategy: 'excludeAll' })
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Role.Admin)
  @ResponseMessage(MSG_PRODUCT_CREATE_SUCCESS)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ResponseMessage(MSG_PRODUCT_FETCH_ALL_SUCCESS)
  async findAll(@Query() filter: ListProducts) {
    const products = await this.productsService.getAllProductsPaginated({
      total: filter.showTotal == 1 ? true : false,
      currentPage: filter.page,
      limit: filter.limit,
    });
    this.logger.debug(`Found ${products.data.length} events`);
    return products;
  }

  @Get(':id')
  @ResponseMessage(MSG_PRODUCT_GET_SUCCESS)
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage(MSG_PRODUCT_UPDATE_SUCCESS)
  @UseGuards(AuthGuardJwt, RolesGuard)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
