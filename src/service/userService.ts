import {User} from "../entity/user";
import {inject, injectable} from "inversify";
import Types from '../config/types';
import {UserRepository} from "../repository/userRepository";
import {logger} from "../utils/logger";

export interface UserService {
  save(user: User): Promise<User>;
}

@injectable()
export class UserServiceImpl implements UserService {

  constructor(
    @inject(Types.UserRepository) private userRepoistory: UserRepository
  ) {}

  public async save(user: User): Promise<User> {
    let created;
    try {
      created = await this.userRepoistory.save(user);
    } catch (e) {
      logger.error(e);
    }
    return created;
  }

}