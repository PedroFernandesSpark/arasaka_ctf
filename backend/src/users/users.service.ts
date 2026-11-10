import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findByEmail(email: string, needId = false, id?: number) {
    if (needId) {
      return this.repo.findOne({ where: { email, id } });
    } else {
      return this.repo.findOne({ where: { email } });
    }
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  // A05 (stored XSS): bio saved without any sanitization.
  async updateBio(id: number, bio: string, userId: number) {
    if (id !== userId) {
      throw new Error("Unauthorized");
    }
    return this.repo.update(id, { bio });
  }
}
