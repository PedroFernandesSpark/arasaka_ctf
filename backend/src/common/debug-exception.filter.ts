import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

// A10 (Mishandling of Exceptional Conditions): instead of hiding the error,
// returns the stack trace in the response body when the status is 500.
@Catch()
export class DebugExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const body: any = { statusCode: status, message: exception.message };
    if (status >= 500) {
      body.stack = exception.stack; // leaks internal details (table name, path...)
    }
    res.status(status).json(body);
  }
}
