import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ default: 'public' })
  accessLevel: 'public' | 'private';

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: 'userId' })
  user: User;
}
