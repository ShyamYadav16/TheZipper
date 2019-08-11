import { User } from '../../src/entity/user';
import {getRepository} from "typeorm";
import {UserRepository} from "../../src/repository/userRepository";
import UploadedFilesBuilder from "./uploadedFilesBuilder";

export default class UserTestBuilder {

  private user: User = new User();

  public static newUser() {
    return new UserTestBuilder();
  }

  public withId(id: number): UserTestBuilder {
    this.user.id = id;
    return this;
  }

  public withName(userName: string): UserTestBuilder {
    this.user.userName = userName;
    return this;
  }

  public withDefaultValues(id: number, userName: string): UserTestBuilder {
    return this.withId(id).withName(userName);
  }

  public build(): User {
    return this.user;
  }

  public static createUser() {
    return UserTestBuilder.newUser().withDefaultValues(1, "testUser").build();
  }

  public static createListOfDefaultUsers(size: number) {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(UserTestBuilder.newUser().withDefaultValues(i, `abcd${i}`).build());
    }
    return result;
  }

  public static getMock() {
    const Mock = jest.fn<UserRepository, []>(() => ({
      findManyUsingWhere: jest.fn().mockReturnValue(this.createUser()),
      save: jest.fn().mockReturnValue(this.createUser()),
      saveArray: jest.fn().mockReturnValue(this.createListOfDefaultUsers(2)),
      repository: getRepository(User)
    }));
    return new Mock();
  }

}