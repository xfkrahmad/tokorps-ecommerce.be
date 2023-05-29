import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { comparePassword } from 'src/helpers/bcrypt.helper';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  private readonly logger = new Logger(LocalStrategy.name);
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username);
    if (!user) {
      this.logger.debug(`User ${username} not found`);
      throw new UnauthorizedException();
    }

    const correctPwd = await comparePassword(password, user.password);

    if (!correctPwd) {
      this.logger.debug(`User ${username} password incorrect`);
      throw new UnauthorizedException();
    }

    return user;
  }
}
