import { Expose } from 'class-transformer';
import { Role } from 'src/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ unique: true })
  @Expose()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column({ name: 'first_name' })
  @Expose()
  firstName: string;

  @Column({ name: 'last_name' })
  @Expose()
  lastName: string;

  @Column('enum', {
    enum: Role,
    default: Role.User,
  })
  @Expose()
  roles: Role[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}

export class LoginingOrRegisteringUser {
  constructor(partial: Partial<LoginingOrRegisteringUser>) {
    Object.assign(this, partial);
  }
  @Expose()
  user: User;

  @Expose()
  token: string;
}
