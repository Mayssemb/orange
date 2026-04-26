import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Candidate } from './candidate.entity';
import { Pfe } from '../pfe/pfe.entity';
import { Express } from 'express';
import { uploadFileToCloudinary } from '../utils/cloudinary_upload';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepo: Repository<Candidate>,

    @InjectRepository(Pfe)
    private pfeRepo: Repository<Pfe>,
  ) {}


async createCandidate(
  file: Express.Multer.File,
  pfeIds: number[],
  name: string,
  email: string,
  phone?: string,
  university?: string,
  status?: string
) {
  if (!file) {
    throw new BadRequestException('File is required');
  }

  if (!name || !email) {
    throw new BadRequestException('Name and email are required');
  }

  if (pfeIds.length > 3) {
    throw new BadRequestException('Maximum 3 PFEs allowed');
  }

  const resumeUrl = await uploadFileToCloudinary(file);

  const choices = await this.pfeRepo.find({
    where: { id: In(pfeIds) },
  });

  if (choices.length !== pfeIds.length) {
    throw new BadRequestException('Some PFEs not found');
  }

  const existing = await this.candidateRepo.findOne({
    where: { email },
  });

  if (existing) {
    throw new BadRequestException('Email already exists');
  }

  const candidate = this.candidateRepo.create({
    name,
    email,
    resumeUrl,
    choices,
    phone,
    university,
    status: status || 'PENDING',
  });

  await this.candidateRepo.save(candidate);

  return {
    message: 'Candidate created successfully',
    candidate,
  };
}
async getAllCandidates() {
  return this.candidateRepo.find(); 

}
async getCandidateById(id: number) {
  const candidate = await this.candidateRepo.findOne({
    where: { id },
  }); 
}}