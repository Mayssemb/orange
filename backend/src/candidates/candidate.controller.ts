import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  Body,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as multer from 'multer';
import { CandidateService } from './candidate.service';
import cloudinary from 'src/config/cloudinary.config';



@Controller('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}
 

@Post()
@UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
async createCandidate(
  @UploadedFile() file: Express.Multer.File,
  @Body('choices') choices: string,
  @Body('name') name: string,
  @Body('email') email: string,
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
  );
}
@Get()
async getAllCandidates() {
  return this.candidateService.getAllCandidates(); 


}

@Get(':id')
async getCandidateById(@Param('id', ParseIntPipe) id: number) {
  return this.candidateService.getCandidateById(id);  }
}
