import { Module } from '@nestjs/common';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { dbConfig } from './database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NotesModule } from './notes/notes.module';
import { AdminController } from './admin/admin.controller';
import { BackupController } from './backup.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    // Serves the compiled frontend (a single origin and URL).
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api/(.*)'],
    }),
    AuthModule,
    UsersModule,
    NotesModule,
  ],
  controllers: [AdminController, BackupController],
})
export class AppModule {}
