import { HttpException, HttpStatus } from '@nestjs/common';
import { MSG_CATEGORY_NOT_FOUND } from 'src/constants/category-response.constant';

export class CategoryNotFoundException extends HttpException {
  constructor() {
    super(
      {
        message: MSG_CATEGORY_NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
        data: null,
        success: false,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
