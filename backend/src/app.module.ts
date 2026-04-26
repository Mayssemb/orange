import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PfeModule } from './pfe/pfe.module';
import { SeedController } from './seed/seed.controller';
import { SeedService } from './seed/seed.service';
import * as dotenv from 'dotenv';
dotenv.config();
import { CandidateModule } from './candidates/candidate.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { CandidateController } from './seed/candidate_seed.controller';
import { CandidateSeedService } from './seed/candidate_seed.service';
import { Pfe } from './pfe/pfe.entity';
import { Candidate } from './candidates/candidate.entity';



@Module({
  imports: [
    
    TypeOrmModule.forRoot({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    autoLoadEntities: true,
    synchronize: true,
}),
    UsersModule,
    AuthModule,
    PfeModule,
    CandidateModule,
    
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Candidate, Pfe]),
  ],
  controllers: [SeedController, CandidateController],
  providers: [SeedService,CandidateSeedService],
 
})

export class AppModule {} 