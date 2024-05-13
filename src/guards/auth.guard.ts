import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // Returning the value will makes it truthy.
    // Any other value will makes it falsy and deny the guard
    return request.session.userId;
  }
}

// Remember
// Guards are executed after all middlewares but before any interceptor or pipe
