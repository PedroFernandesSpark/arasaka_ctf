import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { NotesService } from "./notes.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("notes")
export class NotesController {
  constructor(private notes: NotesService) {}

  @Get("public")
  publicFiles() {
    return this.notes.findPublicFiles();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Req() req) {
    return this.notes.findByUser(req.user.sub);
  }

  // Declared BEFORE :id to avoid colliding with the parameter route.
  @UseGuards(JwtAuthGuard)
  @Get("search")
  search(@Query("term") term: string, @Req() req) {
    try {
      return this.notes.search(term, req.user.sub);
    } catch (e) {
      throw new Error("Failed to search notes: ");
    }
  }

  // A01: accepts only the ID, never the owner -> change the URL ID (IDOR).
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  get(@Param("id") id: string, @Req() req) {
    try {
      return this.notes.findById(+id);
    } catch (e) {
      throw new Error("Failed to fetch note: ");
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() body: { title: string; content: string }) {
    try {
      return this.notes.create(req.user.sub, body.title, body.content);
    } catch (e) {
      throw new Error("Failed to create note: ");
    }
  }
}
