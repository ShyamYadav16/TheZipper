import {UploadedFiles} from "../entity/uploadedfiles";
import {inject, injectable} from "inversify";
import {Types} from "../config/types";
import {UploadedfilesBuilder} from "../builder/uploadedfilesBuilder";
import {Response} from "express";

export interface UploadedfilesService {
  save(fileInfo: any, user_id: number): Promise<UploadedFiles[]>;
  download(id: string, res: Response): void;
}

/**
 * UploadedfilesServiceImpl is a service for file related activities.
 */
@injectable()
export class UploadedfilesServiceImpl implements UploadedfilesService {

  constructor(
    @inject(Types.UploadedfilesBuilder) private uploadedfilesBuilder: UploadedfilesBuilder
  ) {}

  /**
   * This method saves multiple uploaded file information on to the db
   * @param {UploadedFiles[]} uploadedfiles
   * @returns {Promise<string>}
   */
  public async save(fileInfo: any, user_id: number): Promise<UploadedFiles[]> {
    let fileNames: string[] = [];
    for (let fileInfoKey in fileInfo) {
      fileNames.push(fileInfo[fileInfoKey].filename)
    }
    let uploadedFilesBuilder: UploadedfilesBuilder = await this.uploadedfilesBuilder.with(fileNames, user_id);
    return await uploadedFilesBuilder.build();
  }

  /**
   * This method downloads the file by user id
   * @param {string} id
   * @returns {Promise<UploadedFiles[]>}
   */
  public async download(id: string, res: Response) {
    await this.uploadedfilesBuilder.withId(id, res).download();
  }

}

