import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  // A06: no rate limit; no DTO/input validation.
  @Post("login")
  login(@Body() body: { email: string; password: string }) {
    try {
      return this.auth.login(body.email, body.password);
    } catch (e) {
      throw new Error("Login failed: ");
    }
  }
}
