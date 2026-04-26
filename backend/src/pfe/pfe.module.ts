import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pfe } from './pfe.entity';
import { PfeService } from './pfe.service';
import { PfeController } from './pfe.controller';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pfe, User])],
  providers: [PfeService],
  controllers: [PfeController],
  exports: [PfeService],
})
export class PfeModule {}