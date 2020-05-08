import { IsEmail, IsString } from 'class-validator';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { PasswordProtected } from './utils/decorators';

export default class Account {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ select: false })
  @PasswordProtected()
  @IsString()
  passwordHash!: string;

  @Column()
  @PasswordProtected()
  @IsEmail()
  email!: string;
}
