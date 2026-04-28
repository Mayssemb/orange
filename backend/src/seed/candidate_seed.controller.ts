import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as multer from 'multer';
import { CandidateService } from '../recruitment/candidates/candidate.service';
import { CandidateSeedService } from './candidate_seed.service';

@Controller('candidate')
export class CandidateController {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly candidateSeedService: CandidateSeedService, 
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  async createCandidate(
    @UploadedFile() file: Express.Multer.File,
    @Body('choices') choices: string,
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('university') university: string,
    @Body('phone') phone?: string,
    @Body('status') status?: string,
  ) {
    let parsedPfeIds: number[];

    if (typeof choices === 'string') {
      parsedPfeIds = choices.split(',').map(id => parseInt(id.trim(), 10));
    } else {
      parsedPfeIds = choices;
    }

    return this.candidateService.createCandidate(
      file,
      parsedPfeIds,
      name,
      email,
      university,
      phone,
      status,
    );
  }

  @Post('seed')
  async seedCandidates() {
    console.log(' API triggered candidate seeding...');

    await this.candidateSeedService.seed();

    return {
      message: 'Candidates seeded successfully ',
    };
  }
}