import { User } from '../../src/entity/user';
import {UserBuilder, UserBuilderImpl} from "../../src/builder/userBuilder";
import {UserRepository} from "../../src/repository/userRepository";
import {getRepository} from "typeorm";
import {Response} from "express-serve-static-core";

export default class UserTestBuilder {

  private user: User = new User("shyam");

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

  public static getMockRepo() {
    const Mock = jest.fn<UserRepository, []>(() => ({
      findManyUsingWhere: jest.fn().mockReturnValue(this.createUser()),
      save: jest.fn().mockReturnValue(this.createUser()),
      saveArray: jest.fn().mockReturnValue(this.createListOfDefaultUsers(2)),
      repository: getRepository(User)
    }));
    return new Mock();
  }

  public static getMockBuilder() {
    const Mock = jest.fn<UserBuilder, []>(() => ({
      build: jest.fn().mockReturnValue(1),
      with: jest.fn().mockReturnValue(new UserBuilderImpl(this.getMockRepo()))
    }));
    return new Mock();
  }

}