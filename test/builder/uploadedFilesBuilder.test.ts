import {Connection, createConnection, getConnection} from "typeorm";
import {dbOptions} from "../../src/config/db";
import {UploadedfilesBuilder, UploadedfilesBuilderImpl} from "../../src/builder/uploadedfilesBuilder";
import UploadedFilesTestBuilder from "../utils/uploadedFilesTestBuilder";
import {UploadedFiles} from "../../src/entity/uploadedfiles";
import {MESSAGES} from "../../src/config/types";

beforeAll(async () => {
  await createConnection(dbOptions);
});

describe('test uploaded files builder', () => {

  let uploadedfilesBuilder: UploadedfilesBuilder;

  it('should save uploaded files', async () => {
    const mock = UploadedFilesTestBuilder.getMockRepo(2);
    uploadedfilesBuilder = new UploadedfilesBuilderImpl(mock);

    const result: UploadedfilesBuilder = await uploadedfilesBuilder.with(["abc.txt", "xyz.txt"], 1);
    const uploadedFiles: UploadedFiles[] = await result.build();

    expect(mock.saveArray).toHaveBeenCalled();
    expect(uploadedFiles.length).toBe(2);
    expect(uploadedFiles[0]).toHaveProperty("id");
    expect(uploadedFiles[0]).toHaveProperty("fileName");
    expect(uploadedFiles[0]).toHaveProperty("user_id");
    expect(uploadedFiles[0]).toHaveProperty("created");
    expect(uploadedFiles[0].user_id).toBe(1);

  });

  it('should set and get user id', async () => {
    const mock = UploadedFilesTestBuilder.getMockRepo(2);
    uploadedfilesBuilder = new UploadedfilesBuilderImpl(mock);

    const result: UploadedfilesBuilder = await uploadedfilesBuilder.withId("1", null);
    expect(result).toHaveProperty("user_id");
    expect(result).toHaveProperty("res");
    expect(result.getId()).toEqual("1");
  });

  it('should throw files not found', async () => {
    let mock;
    try {
      mock = UploadedFilesTestBuilder.getMockRepo(0);
      uploadedfilesBuilder = new UploadedfilesBuilderImpl(mock);

      const builder: UploadedfilesBuilder = await uploadedfilesBuilder.withId("1", null);
      const result = await builder.download();
    } catch (e) {
      expect(mock.findManyUsingWhere).toHaveBeenCalled();
      expect(e.message).toEqual(`${MESSAGES.FILES_NOT_FOUND} 1`);
    }
  });

});