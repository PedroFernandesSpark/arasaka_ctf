import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email, false);

    // A07: different messages allow valid users to be enumerated.
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    // A04/A07: plaintext password comparison.
    if (user.password !== password) {
      throw new UnauthorizedException("Incorrect password");
    }

    // Non-expiring token signed with a weak secret (see auth.module.ts).
    const access_token = await this.jwt.signAsync({
      sub: user.id,
      role: user.role,
    });
    return { access_token, flag: `FLAG{${user.password}}` };
  }
}
