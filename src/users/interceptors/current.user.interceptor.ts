// This interceptor exist because the parameter decorator does not have access to dependencies from dependency injection.
// Then it can't have access to the usersService dependency.
// So we'll use an interceptor that will get the current user then use the value produced by this interceptor in the decorator.
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    if (userId) {
      const user = await this.usersService.findOne(userId);
      // assign the user to the decorator;
      request.currentUser = user;
    }
    return handler.handle();
  }
}

// To use this interceptor, there are 2 ways.

// Method 1
// Mark it as injectable
// in users.module, declare it as a provider
// in the controller, add useInterceptor on the controller/method you want it to apply on.
// downside : You need to import it whenever you want to use it.

// Method 2
// Apply the interceptor on the users module, using APP_INTERCEPTOR (see in users.module.ts)
// WARN : this kind of setting up an interceptor makes it available in all the application,
// not only in the controllers defined in the module.
// Hence any controller that DOES NOT need this interceptor will still generate traffic to database to fetch the user.

// Method 2 is kept in the module, but we'll stick with method 1 for now.
// edit : we switched to method2 when adding relationships between users and reports since we need to have the current user when creating a report
// Tried to share the interceptor between modules but didn't make it work.
