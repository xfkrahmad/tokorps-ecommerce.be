import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/api/users/dto/create-user.dto';
import {
  LoginingOrRegisteringUser,
  User,
} from 'src/api/users/entities/user.entity';
import { UsersService } from 'src/api/users/users.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuardLocal } from 'src/guards/auth-guard.local';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/decorators/response.decorator';
import {
  MSG_LOGIN_SUCCESS,
  MSG_REGISTER_SUCCESS,
} from 'src/constants/auth-response.constant';
import { Response } from 'express';

@Controller('auth')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @Post('login')
  @UseGuards(AuthGuardLocal)
  @ResponseMessage(MSG_LOGIN_SUCCESS)
  @HttpCode(200)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = this.authService.getTokenForUser(user);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    return new LoginingOrRegisteringUser({
      user,
      token,
    });
  }

  @Post('register')
  @ResponseMessage(MSG_REGISTER_SUCCESS)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }
}
