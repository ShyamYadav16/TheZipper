import {createConnection} from "typeorm";
import {dbOptions} from "../../src/config/db";
import UserTestBuilder from "../utils/userTestBuilder";
import {UserService, UserServiceImpl} from "../../src/service/userService";

beforeAll(async () => {
  await createConnection(dbOptions);
});

describe('test user service', () => {

  let userService: UserService;

  it('should save user', async () => {
    const mock = UserTestBuilder.getMockBuilder();
    userService = new UserServiceImpl(mock);

    const id: number = await userService.save("shyam");
    expect(mock.with).toHaveBeenCalled();
    expect(id).toBe(1);
  })

});