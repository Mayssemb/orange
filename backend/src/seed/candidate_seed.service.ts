import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from '../candidates/candidate.entity';
import { Pfe } from '../pfe/pfe.entity';
import cloudinary from '../config/cloudinary.config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CandidateSeedService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepo: Repository<Candidate>,

    @InjectRepository(Pfe)
    private readonly pfeRepo: Repository<Pfe>,
  ) {}

  async uploadFile(filePath: string): Promise<string> {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      folder: 'resumes',
    });

    return result.secure_url;
  }

  async seed() {
    console.log(' Seeding candidates with REAL files...');

    const pfes = await this.pfeRepo.find();

    if (pfes.length === 0) {
      console.log(' No PFEs found. Seed PFEs first.');
      return;
    }

    const getRandomChoices = () => {
      const shuffled = [...pfes].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    };

    const files = [
      'cv1_marketing.pdf',
      'cv2_SE.pdf',
      'cv3_networks.pdf',
    ];

    const candidatesData = [
      {
        name: 'Alice Ben Salah',
        email: 'alice@example.com',
        phone: '12345678',
        university: 'INSAT',
        file: files[0],
      },
      {
        name: 'Mohamed Trabelsi',
        email: 'mohamed@example.com',
        phone: '87654321',
        university: 'ENIT',
        file: files[1],
      },
      {
        name: 'Sara Khelifi',
        email: 'sara@example.com',
        phone: null,
        university: 'FST',
        file: files[2],
      },
    ];

    for (const data of candidatesData) {
      const exists = await this.candidateRepo.findOne({
        where: { email: data.email },
      });

      if (exists) {
        console.log(` Already exists: ${data.email}`);
        continue;
      }

      const filePath = path.join(
        './files', //Try with absolute path if this doesn't work
        data.file,
      );

      if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        console.log(' Skipping candidate:', data.email);
        continue;
      }

      const resumeUrl = await this.uploadFile(filePath);

      const candidate = this.candidateRepo.create({
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        university: data.university,
        resumeUrl,
        choices: getRandomChoices(),
        status: 'PENDING',
      });

      await this.candidateRepo.save(candidate);

      console.log(` Created: ${data.email}`);
    }

  }
}