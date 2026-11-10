import { Controller, ForbiddenException, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  // The role is trusted without verifying the account's privileges (A07).
  @Get('flag')
  flag(@Req() req) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException();
    }
    return { flag: process.env.FLAG_ADMIN || 'FLAG{vesper_directorate_access}' };
  }

  @Get('ssh-access')
  sshAccess(@Req() req) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException();
    }
    return {
      host: process.env.SSH_HOST || req.hostname || 'localhost',
      port: Number(process.env.SSH_PORT || 2222),
      username: process.env.SSH_USERNAME || 'operator',
      password: process.env.SSH_PASSWORD || 'NacarArchive09',
    };
  }
}
