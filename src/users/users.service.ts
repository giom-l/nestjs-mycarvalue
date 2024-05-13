import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    console.log(`[UserService] Creating user ${email}`);
    // First create then save user ensure all entity hooks run properly
    const created_user = this.repo.create({ email, password });
    return this.repo.save(created_user);
  }
  findOne(id: number): Promise<User | null> {
    console.log(`[UserService] Looking for user with id ${id}`);
    // with sqlite, not handling null id could lead to retrieve the first item in the database. Not good.
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id: id });
  }
  find(email: string): Promise<User[] | []> {
    console.log(`[UserService] Looking for users with email ${email}`);
    return this.repo.findBy({ email: email });
    // also correct
    // return this.repo.find({where : { email : email }});
  }

  //Partial is builtin into typescript and let us provide an object that has no, one, mulitiple or all properties of the type User.
  // But it will complain if a property that does not belong to User type is provided
  async update(id: number, attrs: Partial<User>) {
    console.log(`[UserService] Updating user with id ${id}`);
    // update does not call entity hooks
    // But otherwise we would have to retrieve our user from DB, update it then save it (2 db operations)
    // return this.repo.update({ id: id }, attrs);
    const user = await this.findOne(id);
    if (!user) {
      // Throwing http errors could be wrong in case our service is consumed by anything else that http controller (like websocket or grpc)
      // Those may not be able to handle them
      throw new NotFoundException(`[UserService] No user found with id ${id}`);
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    console.log(`[UserService] Deleting user with id ${id}`);
    const removed_user = await this.findOne(id);
    if (!removed_user) {
      // throw new Error(`[UserService] No user found with id ${id}`);
      // Throwing http errors could be wrong in case our service is consumed by anything else that http controller (like websocket or grpc)
      // Those may not be able to handle them
      throw new NotFoundException(`[UserService] No user found with id ${id}`);
    }
    return this.repo.remove(removed_user);
    // Calling delete does not trigger entity hooks
    // But its a tradeoff for performance
    // await this.repo.delete({ id: id });
  }
}
