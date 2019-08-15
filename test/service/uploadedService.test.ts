import "reflect-metadata";
import {UploadedfilesService, UploadedfilesServiceImpl} from "../../src/service/uploadedfilesService";
import UploadedFilesTestBuilder from "../utils/uploadedFilesTestBuilder";
import {json, Response} from "express";
import {createConnection} from "typeorm";
import {dbOptions} from "../../src/config/db";
import {UploadedFiles} from "../../src/entity/uploadedfiles";

beforeAll(async () => {
  await createConnection(dbOptions);
});

describe('test uploaded files service', () => {

  let uploadedfilesService: UploadedfilesService;

  const fileInfo = [
    {
      fileName: "abc0.txt"
    },
    {
      fileName: "abc1.txt"
    }
  ]

  it('should save uploaded files', async () => {
    let mock = UploadedFilesTestBuilder.getMockBuilder();
    uploadedfilesService = new UploadedfilesServiceImpl(mock);

    const uploadedFiles: UploadedFiles[] = await uploadedfilesService.save(fileInfo, 1);
    expect(mock.with).toHaveBeenCalled();
    expect(uploadedFiles.length).toBe(2);
  });

  // it('should download files', async () => {
  //   let mock = UploadedFilesTestBuilder.getMockBuilder();
  //   uploadedfilesService = new UploadedfilesServiceImpl(mock);
  //
  //   await uploadedfilesService.download("1", res);
  //   expect(mock.withId).toHaveBeenCalled();
  // });

});