import { HttpException, HttpStatus } from '@nestjs/common';
import { MSG_USER_ALREADY_EXISTS } from 'src/constants/user-response.constant';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super(
      {
        message: MSG_USER_ALREADY_EXISTS,
        statusCode: HttpStatus.BAD_REQUEST,
        data: null,
        success: false,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
