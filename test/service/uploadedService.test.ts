import {UploadedfilesService, UploadedfilesServiceImpl} from "../../src/service/uploadedfilesService";
import UploadedFilesBuilder from "../utils/uploadedFilesBuilder";
import {createConnection} from "typeorm";
import {dbOptions} from "../../src/config/db";
import {MESSAGES} from "../../src/config/types";

beforeAll(async () => {
  await createConnection(dbOptions);
})

describe('test uploadedFiles service', () => {

  let ufService: UploadedfilesService;

  it('should return uploaded files', async () => {
    let mock = UploadedFilesBuilder.getMock(2);
    ufService = new UploadedfilesServiceImpl(mock);

    let result = await ufService.getUploadedFilesById("1");

    expect(mock.findManyUsingWhere).toHaveBeenCalled();
    expect(result.length).toBe(2);
  })

  it('should save uploaded files', async () => {
    let mock = UploadedFilesBuilder.getMock(2);
    ufService = new UploadedfilesServiceImpl(mock);

    let result = await ufService.save(UploadedFilesBuilder.createListOfDefaultUploadedFiles(2));
    expect(mock.saveArray).toHaveBeenCalled();
    expect(result.length).toEqual(2);
  });

  it('should save zero uploaded files', async () => {
    let mock = UploadedFilesBuilder.getMock(0);
    ufService = new UploadedfilesServiceImpl(mock);

    let result = await ufService.save(UploadedFilesBuilder.createListOfDefaultUploadedFiles(0));
    expect(mock.saveArray).toHaveBeenCalled();
    expect(result.length).toEqual(0);
  });

});