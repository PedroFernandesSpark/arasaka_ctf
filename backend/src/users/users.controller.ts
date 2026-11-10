import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("users")
export class UsersController {
  constructor(private users: UsersService) {}

  // Public profile: anyone can view the bio.
  @Get(":id")
  async profile(@Param("id") id: string) {
    try {
      const u = await this.users.findById(+id);
      if (!u) throw new NotFoundException();
      return { id: u.id, email: u.email, role: u.role, bio: u.bio };
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put("me/bio")
  updateBio(@Req() req, @Body() body: { bio: string }) {
    try {
      return this.users.updateBio(req.user.sub, body.bio, req.user.sub);
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
