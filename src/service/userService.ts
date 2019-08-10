import {User} from "../entity/user";
import {inject, injectable} from "inversify";
import {Types} from '../config/types';
import {UserRepository} from "../repository/userRepository";
import {logger} from "../utils/logger";

export interface UserService {
  save(user: User): Promise<User>;
}


/**
 * UserServiceImpl is a service for user related activities.
 */
@injectable()
export class UserServiceImpl implements UserService {

  constructor(
    @inject(Types.UserRepository) private userRepoistory: UserRepository
  ) {}

  /**
   * This service saves user entity on to db
   * @param {User} user
   * @returns {Promise<User>}
   */
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