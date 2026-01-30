import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = Date.now();
    return next.handle().pipe(
      tap((data) => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;
        this.logger.log(`[${method}] ${url} ${statusCode} - ${Date.now() - now}ms`);
      })
    );
  }
}
