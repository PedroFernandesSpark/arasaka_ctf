import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { JWT_SIGNING_SECRET } from './jwt-secret';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // A07: test key recoverable from the exposed backup endpoint.
    JwtModule.register({ secret: JWT_SIGNING_SECRET }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
