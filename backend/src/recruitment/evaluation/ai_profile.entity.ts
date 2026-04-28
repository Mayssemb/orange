import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Candidate } from '../candidates/candidate.entity';

@Entity()
export class AIProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'float', nullable: true })
  matchScore?: number;

  @Column({ type: 'float', nullable: true })
  technicalScore?: number;

  @Column({ type: 'float', nullable: true })
  experienceScore?: number;

  @Column({ type: 'json', nullable: true })
  embedding?: number[]; // vector for similarity search

  @Column({ type: 'json', nullable: true })
  explanation?: any; // XAI: "why this candidate scored 82%"

  // @OneToOne(() => Candidate, (c) => c.aiProfile)
  // candidate!: Candidate;
}