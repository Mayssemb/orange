
import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

import { CandidateService } from './candidate.service';
import { Express } from 'express';

@Controller('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
    }),
  )
  async createCandidate(
    @UploadedFile() file: Express.Multer.File,
    @Body('choices') choices: string,
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('university') university: string,
    @Body('phone') phone?: string,
    @Body('status') status?: string,
  ) {
 

    const pfeIds = choices
      ? choices.split(',').map((id) => parseInt(id.trim(), 10))
      : [];

    return this.candidateService.createCandidate(
      file,
      pfeIds,
      name,
      email,
      university,
      phone,
      status,
    );
  }

  
  @Get()
  async getAllCandidates() {
    return this.candidateService.getAllCandidates();
  }

  
  @Get(':id')
  async getCandidateById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.candidateService.getCandidateById(id);
  }
}