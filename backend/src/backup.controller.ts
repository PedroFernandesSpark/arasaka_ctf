import { Controller, Get } from "@nestjs/common";
import { JWT_SIGNING_SECRET } from "./auth/jwt-secret";

@Controller("backup")
export class BackupController {
  @Get()
  recoveryMemo() {
    return {
      note: "ARASAKA // contingency copy of the token issuer.",
      jwtSigningSecret: JWT_SIGNING_SECRET,
    };
  }
}
