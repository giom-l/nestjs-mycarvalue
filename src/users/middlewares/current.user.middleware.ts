// This was originally defined as an interceptor that has been left into the code but not used anymore.
// The reason is that data produced by interceptor (ie currentUser) can't be used in middlewares or guards (since interceptor run after those 2)

import { NestMiddleware, Injectable } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import AppRequest from '../@types/express';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: AppRequest, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    if (userId) {
      const user = await this.usersService.findOne(userId);
      // assign the user to the request;
      req.currentUser = user;
    }
    next();
  }
}
