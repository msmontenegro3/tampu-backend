import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(nombre: string, email: string, password: string, rol: UserRole) {
    console.log('Repo:', this.usersRepository);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      nombre,
      email,
      password: hashedPassword,
      rol,
    });
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }
}
