import {UserBuilder, UserBuilderImpl} from "../../src/builder/userBuilder";
import {Connection, createConnection, getConnection} from "typeorm";
import UserTestBuilder from "../utils/userTestBuilder";
import {dbOptions} from "../../src/config/db";
import httpStatus from "http-status";
import {ValidationError} from "class-validator";
import {NextFunction, Response} from "express";

beforeAll(async () => {
  await createConnection(dbOptions);
});

describe('test user builder', () => {

  let userBuilder: UserBuilder;

  it('should build user', async () => {
    const mock = UserTestBuilder.getMockRepo();
    userBuilder = new UserBuilderImpl(mock);

    const result = await userBuilder.with(UserTestBuilder.createUser().userName);
    const id: number = await result.build();

    expect(mock.save).toHaveBeenCalled();
    expect(id).toBe(1);
  });

  it('should throw error if userName is empty', async () => {
    try {
      await userBuilder.with("");
    } catch(e) {
     const error: ValidationError[] = e;
     expect(error.length).toBe(1);
     expect(e[0].property).toBe("userName");
     expect(e[0].constraints).toHaveProperty("length");
     expect(e[0].constraints.length).toEqual("userName must be longer than or equal to 3 characters");
    }
  });

});