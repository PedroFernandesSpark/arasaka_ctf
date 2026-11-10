import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Note } from "./note.entity";

@Injectable()
export class NotesService {
  constructor(@InjectRepository(Note) private repo: Repository<Note>) {}

  findByUser(userId: number) {
    return this.repo.find({ where: { userId, accessLevel: 'private' } });
  }

  findPublicFiles() {
    return this.repo.find({
      where: { accessLevel: 'public' },
      order: { id: 'ASC' },
    });
  }

  // A01 (Broken Access Control / IDOR): looks up only by ID, ignoring ownership.
  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(userId: number, title: string, content: string) {
    return this.repo.save(this.repo.create({ userId, title, content, accessLevel: 'private' }));
  }

  search(term: string, userId: number) {
    return this.repo
      .createQueryBuilder("n")
      .where("n.title LIKE :term", { term })
      .andWhere("n.userId = :userId", { userId })
      .getMany();
  }
}
