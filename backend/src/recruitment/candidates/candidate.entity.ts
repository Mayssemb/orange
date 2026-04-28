import { Entity, PrimaryGeneratedColumn, Column, JoinTable ,ManyToMany,OneToMany,OneToOne} from 'typeorm';
import { Pfe } from '../../pfe/pfe.entity';
import { CandidateStatus } from 'src/common/enums/candidatestatus.enum';

// import { AIProfile } from '../evaluation/ai_profile.entity';

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  university!: string;

  @Column({ nullable: true }) 
  resumeUrl!: string;

  @Column(
    { type: 'enum', enum: ['PENDING', 'APPROVED','EVALUATED','REJECTED'], default: 'PENDING' }, )
  status!: string;

 @Column({ type: 'json', nullable: true })
  Education!: string[];
  @Column({ type: 'json', nullable: true })
   Experience!: string[];
  @Column({ type: 'json', nullable: true })
  Project!: string[];
  @Column({ type: 'json', nullable: true })
  Skill!: string[];
  

  @ManyToMany(() => Pfe, { eager: true })
  @JoinTable()
  choices!: Pfe[];


//   @OneToOne(() => AIProfile, (ai) => ai.candidate,  {
//      cascade: true,
//      nullable: true,
//   }
// )
//   aiProfile!: AIProfile;

}
