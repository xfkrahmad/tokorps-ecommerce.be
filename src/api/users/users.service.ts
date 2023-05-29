import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/api/auth/auth.service';
import { UserAlreadyExistsException } from 'src/exceptions/user-alreadyexists.exception';
import { hashPassword } from 'src/helpers/bcrypt.helper';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginingOrRegisteringUser, User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });
    this.logger.debug(existingUser);
    if (existingUser) {
      throw new BadRequestException('username or email already exists');
    }
    const user = await this.userRepository.create({
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
    });
    await this.userRepository.save({
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
    });
    const token = await this.authService.getTokenForUser(user);
    return new LoginingOrRegisteringUser({ user, token });
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(by: string, value: any) {
    return await this.userRepository.findOne({ where: { [by]: value } });
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    const selectedUser = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
    });

    const existUser = await this.userRepository.findOne({
      where: [
        {
          username: updateUserDto.username,
          email: updateUserDto.email,
        },
      ],
    });

    if (existUser) {
      throw new UserAlreadyExistsException();
    }

    const updatedUser = await this.userRepository.save(
      new User({
        ...selectedUser,
        ...updateUserDto,
      }),
    );
    return updatedUser;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
