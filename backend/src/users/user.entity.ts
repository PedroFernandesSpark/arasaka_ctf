import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Note } from '../notes/note.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // A04 (Cryptographic Failures): password stored in plaintext.
  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ type: 'text', default: '' })
  bio: string;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];
}
