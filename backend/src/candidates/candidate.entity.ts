import { Entity, PrimaryGeneratedColumn, Column, JoinTable ,ManyToMany} from 'typeorm';
import { Pfe } from '../pfe/pfe.entity';
import { Status } from 'src/common/enums/status.enum';
@Entity()
export class Candidate {
@PrimaryGeneratedColumn()
id: number ;   
@Column()
name: string;

@Column({ unique: true })
email: string;

@Column ({ nullable: true })
phone?: string;

@Column ({ nullable: false })
university: string;

@ManyToMany(() => Pfe, { eager: true })
@JoinTable()
choices: Pfe[];

@Column({ nullable: true })
resumeUrl: string;

@Column(
    { type: 'enum', enum: ['PENDING', 'APPROVED','EVALUATED'], default: 'PENDING' }, )
  status: string;

}