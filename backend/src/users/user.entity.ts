import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '../common/enums/role.enum';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
  

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.TEAM_LEAD,
  })
  role: Role;

  @Column()
  department: string;
}