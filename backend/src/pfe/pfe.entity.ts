import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Status } from '../common/enums/status.enum';

@Entity()
export class Pfe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  duration!: number; 

  @Column()
  number_of_interns!: number;

  @Column('simple-array') 
  technologies!: string[];

  @Column()
  diploma!: string;

  @Column(
    { type: 'enum', enum: Status, default: Status.PENDING }, )
  status!: Status;
  
  @Column()
  direction!: string;

  @ManyToOne(() => User, { eager: true })
  teamLead!: User;
}