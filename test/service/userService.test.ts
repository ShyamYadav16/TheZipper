import {UploadedfilesService, UploadedfilesServiceImpl} from "../../src/service/uploadedfilesService";
import UploadedFilesBuilder from "../utils/uploadedFilesBuilder";
import {createConnection} from "typeorm";
import {dbOptions} from "../../src/config/db";
import {MESSAGES} from "../../src/config/types";
import UserTestBuilder from "../utils/userTestBuilder";
import {UserService, UserServiceImpl} from "../../src/service/userService";

beforeAll(async () => {
  await createConnection(dbOptions);
})

describe('test user service', () => {

  let userService: UserService;

  it('should save user', async () => {
    let mock = UserTestBuilder.getMock();
    userService = new UserServiceImpl(mock);

    let result = await userService.save(UserTestBuilder.createUser());
    expect(mock.save).toHaveBeenCalled();
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("userName");
    expect(result).toEqual(UserTestBuilder.createUser());
  });

});