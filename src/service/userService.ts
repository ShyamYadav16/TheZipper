import {User} from "../entity/user";
import {inject, injectable} from "inversify";
import {Types} from '../config/types';
import {UserBuilder} from "../builder/userBuilder";

export interface UserService {
  save(userName: string): Promise<number>;
}


/**
 * UserServiceImpl is a service for user related activities.
 */
@injectable()
export class UserServiceImpl implements UserService {

  constructor(
    @inject(Types.UserBuilder) private userBuilder: UserBuilder
  ) {}

  /**
   * This service saves user entity on to db
   * @param {User} user
   * @returns {Promise<User>}
   */
  public async save(userName: string): Promise<number> {
    let userBuilder: UserBuilder = await this.userBuilder.with(userName);
    return await userBuilder.build();
  }

}

