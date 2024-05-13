import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Returning the value will makes it truthy.
    // Any other value will makes it falsy and deny the guard
    if (!request.currentUser) {
      return false;
    }
    return request.currentUser.admin;
  }
}

// Remember
// Guards are executed after all middlewares but before any interceptor or pipe
