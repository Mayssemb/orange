import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import bcrypt from 'bcrypt';
@Injectable()
export class UsersService {

  findById(teamLeadId: number) {
    throw new Error('Method not implemented.');
  }
  constructor(@InjectRepository(User) private repo: Repository<User>) {}



async create(data: { password: string; [key: string]: any }) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const userData = { ...data, password: hashedPassword };

  const user = this.repo.create(userData);

  return this.repo.save(user);
}


  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }
  findAll() {
    return this.repo.find();
  } 
  update(id: number, data) {
    return this.repo.update(id, data);
  }
  async updatePassword(id: number, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword,10);
    return this.repo.update(id, { password: hashedPassword });
  }
  delete(id: number) {
    return this.repo.delete(id);
  }
}