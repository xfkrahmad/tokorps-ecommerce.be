import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/api/users/entities/user.entity';
import { UsersService } from 'src/api/users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async validateUser(username: string): Promise<User | undefined> {
    const user = await this.usersService.findOne('username', username);
    if (user) {
      return user;
    }
    return null;
  }

  getTokenForUser(user: User): string {
    return this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });
  }
}
