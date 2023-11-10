import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existUser) throw new BadRequestException('This user already exist');

    const hashedPassword = await argon2.hash(createUserDto.password);
    const user = await this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });

    axios
      .post('http://localhost:3001/api/events', {
        type: 'USER_CREATED',
        payload: { id: user.id, email: user.email },
      })
      .catch((error) => {
        console.error('Ошибка при отправке события USER_CREATED:', error);
      });

    return { id: user.id, email: user.email };
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException(`User not found`);
    }

    await this.userRepository.update(id, updateUserDto);

    axios
      .post('http://localhost:3001/api/events', {
        type: 'USER_UPDATED',
        payload: { id, ...updateUserDto },
      })
      .catch((error) => {
        console.error('Ошибка при отправке события USER_UPDATED:', error);
      });

    return this.userRepository.findOne({
      where: { id },
    });
  }
}
