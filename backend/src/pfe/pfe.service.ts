import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pfe } from './pfe.entity';
import { Status } from 'src/common/enums/status.enum';
import { User } from 'src/users/user.entity';

@Injectable()
export class PfeService {

  constructor(
    @InjectRepository(Pfe) private repo: Repository<Pfe> ,

    @InjectRepository(User) private readonly userRepository: Repository<User>,){}
   

  async create(dto,  teamLeadId: number) {
    const user = await this.userRepository.findOneBy({ id: teamLeadId });
    if (!user) {
      throw new NotFoundException(`User with id ${teamLeadId} not found`);
    }
    const pfe = this.repo.create({ ...dto, teamLead: user });
    return this.repo.save(pfe);
  }

  findAll() {
    return this.repo.find();
  }

  async updateStatus(id: number, status: Status) {
  await this.repo.update(id, { status });

  return { message: 'Status updated successfully' };
}
async updateOwner(id: number, teamLeadId: number) {
  const user = await this.userRepository.findOneBy({ id: teamLeadId });
  if (!user) {
    throw new NotFoundException(`User with id ${teamLeadId} not found`);
  }
  await this.repo.update(id, { teamLead: user });
  return this.repo.findOne({ where: { id }, relations: ['teamLead'] });
}
async delete(id: number) {
  const result = await this.repo.delete(id);
  if (result.affected === 0) {
    throw new NotFoundException(`PFE with id ${id} not found`);
  }
  return { message: 'PFE deleted successfully' }; 

}
}