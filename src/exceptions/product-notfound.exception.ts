import { HttpException, HttpStatus } from '@nestjs/common';
import { MSG_PRODUCT_NOT_FOUND } from 'src/constants/product-response.contanst';

export class ProductNotFoundException extends HttpException {
  constructor() {
    super(
      {
        message: MSG_PRODUCT_NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
        data: null,
        success: false,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
