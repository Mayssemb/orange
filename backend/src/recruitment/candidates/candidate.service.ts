// import { Injectable, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, In } from 'typeorm';
// import { Candidate } from './candidate.entity';
// import { Pfe } from '../../pfe/pfe.entity';
// import { Express } from 'express';
// import { uploadFileToCloudinary } from '../../utils/cloudinary_upload';

// @Injectable()
// export class CandidateService {
//   constructor(
//     @InjectRepository(Candidate)
//     private candidateRepo: Repository<Candidate>,

//     @InjectRepository(Pfe)
//     private pfeRepo: Repository<Pfe>,
//   ) {}


// async createCandidate(
//   file: Express.Multer.File,
//   pfeIds: number[],
//   name: string,
//   email: string,
//   phone?: string,
//   university?: string,
//   status?: string
// ) {
//   if (!file) {
//     throw new BadRequestException('File is required');
//   }

//   if (!name || !email) {
//     throw new BadRequestException('Name and email are required');
//   }

//   if (pfeIds.length > 3) {
//     throw new BadRequestException('Maximum 3 PFEs allowed');
//   }

//   const resumeUrl = await uploadFileToCloudinary(file);

//   const choices = await this.pfeRepo.find({
//     where: { id: In(pfeIds) },
//   });

//   if (choices.length !== pfeIds.length) {
//     throw new BadRequestException('Some PFEs not found');
//   }

//   const existing = await this.candidateRepo.findOne({
//     where: { email },
//   });

//   if (existing) {
//     throw new BadRequestException('Email already exists');
//   }

//   const candidate = this.candidateRepo.create({
//     name,
//     email,
//     resumeUrl,
//     choices,
//     phone,
//     university,
//     status: status || 'PENDING',
//   });

//   await this.candidateRepo.save(candidate);

//   return {
//     message: 'Candidate created successfully',
//     candidate,
//   };
// }
// async getAllCandidates() {
//   return this.candidateRepo.find(); 

// }
// async getCandidateById(id: number) {
//   const candidate = await this.candidateRepo.findOne({
//     where: { id },
//   }); 
// }}

import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import axios from 'axios';
import FormData from 'form-data';

import { Candidate } from './candidate.entity';
import { Pfe } from '../../pfe/pfe.entity';
import { Express } from 'express';
import { uploadFileToCloudinary } from '../../utils/cloudinary_upload';
import { CandidateStatus } from 'src/common/enums/candidatestatus.enum';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepo: Repository<Candidate>,

    @InjectRepository(Pfe)
    private pfeRepo: Repository<Pfe>,
  ) {}

  // =========================
  // CALL FLASK CV PARSER
  // =========================
  private async parseCv(file: Express.Multer.File) {
    const form = new FormData();
    form.append('file', file.buffer, file.originalname);

    const response = await axios.post(
      'http://127.0.0.1:8000/parse-cv',
      form,
      {
        headers: form.getHeaders(),
      },
    );

    return response.data;
  }

  // =========================
  // MAP CV → ENTITY FIELDS
  // =========================
  private mapCv(sections: any[]) {
    const Education: string[] = [];
    const Experience: string[] = [];
    const Project: string[] = [];
    const Skill: string[] = [];

    for (const s of sections || []) {
      const label = s.label;
      const text = s.text;

      switch (label) {
        case 'education':
          Education.push(text);
          break;
        case 'experience':
          Experience.push(text);
          break;
        case 'projects':
          Project.push(text);
          break;
        case 'skills':
          Skill.push(text);
          break;
      }
    }

    return { Education, Experience, Project, Skill };
  }

  // =========================
  // CREATE CANDIDATE
  // =========================
  async createCandidate(
    file: Express.Multer.File,
    pfeIds: number[],
    name: string,
    email: string,
    university: string,
    phone?: string,
    status?: string
  ) {
    if (!file) throw new BadRequestException('File is required');
    if (!name || !email)
      throw new BadRequestException('Name and email are required');

    if (pfeIds.length > 3)
      throw new BadRequestException('Maximum 3 PFEs allowed');
    if (!university)  // ✅ ADD THIS
    throw new BadRequestException('University is required'); 

    // Upload CV
    const resumeUrl = await uploadFileToCloudinary(file);

    // Get PFEs
    const choices = await this.pfeRepo.find({
      where: { id: In(pfeIds) },
    });

    if (choices.length !== pfeIds.length) {
      throw new BadRequestException('Some PFEs not found');
    }

    // Check duplicate email
    const existing = await this.candidateRepo.findOne({
      where: { email },
    });

    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    // 🔥 Parse CV from Flask API
    const parsedCv = await this.parseCv(file);

    if (!parsedCv.success) {
      throw new BadRequestException('CV parsing failed');
    }

    // 🔥 Map sections to entity fields
    const mapped = this.mapCv(parsedCv.sections);


    // Create candidate
    const candidate = this.candidateRepo.create({
      name,
      email,
      resumeUrl,
      choices,
      university,
      phone,
      status:'PENDING',

      Education: mapped.Education,
      Experience: mapped.Experience,
      Project: mapped.Project,
      Skill: mapped.Skill,
    });

    

    await this.candidateRepo.save(candidate);

    return {
      message: 'Candidate created successfully',
      candidate,
    };
  }

  // =========================
  // GET ALL
  // =========================
  async getAllCandidates() {
    return this.candidateRepo.find();
  }

  // =========================
  // GET BY ID
  // =========================
  async getCandidateById(id: number) {
    return this.candidateRepo.findOne({
      where: { id },
    });
  }
}