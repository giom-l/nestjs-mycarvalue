import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Param decorators exists outside the dependency injection system.
// So our decorator can't get an instance of UsersService directly.

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
