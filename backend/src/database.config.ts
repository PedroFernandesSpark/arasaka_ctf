import { DataSourceOptions } from 'typeorm';
import { User } from './users/user.entity';
import { Note } from './notes/note.entity';

export const dbConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'ctf',
  password: process.env.DB_PASSWORD || 'ctf',
  database: process.env.DB_NAME || 'nacar_archive',
  entities: [User, Note],
  synchronize: true, // acceptable for this exercise; NEVER in production
};
