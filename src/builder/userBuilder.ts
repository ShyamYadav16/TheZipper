import {inject, injectable} from "inversify";
import {UserRepository} from "../repository/userRepository";
import {Types} from "../config/types";
import {User} from "../entity/user";
import {validation} from "../utils/helper";

export interface UserBuilder {
  with(userName: string): Promise<UserBuilder>;
  build(): Promise<number>;
}

/**
 * UserBuilder helps in building User data
 */
@injectable()
export class UserBuilderImpl implements UserBuilder {

  constructor(
    @inject(Types.UserRepository) private userRepository: UserRepository
  ) {}

  private user: User = null;

  /**
   * Builder method to hold the userName and also validate user Entity.
   * @param {string} userName
   * @returns {Promise<UserBuilder>}
   */
  public async with(userName: string): Promise<UserBuilder> {
    this.user = new User(userName);
    await validation(this.user);
    return this;
  }

  /**
   * Builder method to save the field condition data into user table
   * @returns {Promise<number>} user id
   */
  public async build(): Promise<number> {
    let created: User = await this.userRepository.save(this.user);
    return created.id;
  }

}