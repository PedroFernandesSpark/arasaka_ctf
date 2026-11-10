import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DebugExceptionFilter } from './common/debug-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // API under /api; the rest serves the frontend

  // === Intentionally weak configuration (A02 / A06) ===
  // CORS enabled for any origin, with credentials:
  app.enableCors({ origin: true, credentials: true });
  // No Helmet (no security headers).
  // No global ValidationPipe (no DTO validates input).

  // A10: filter leaks stack traces in the response body for 500 errors.
  app.useGlobalFilters(new DebugExceptionFilter());

  await app.listen(3000, '0.0.0.0'); // 0.0.0.0 = reachable on the local network
  console.log('Backend listening at http://localhost:3000');
}
bootstrap();
