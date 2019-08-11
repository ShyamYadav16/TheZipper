import {UploadedFiles} from "../entity/uploadedfiles";
import {inject, injectable} from "inversify";
import {UploadedfilesRepository} from "../repository/uploadedfilesRepository";
import {Types, MESSAGES} from "../config/types";
import {logger} from "../utils/logger";

export interface UploadedfilesService {
  save(uploadedfiles: UploadedFiles[]): Promise<UploadedFiles[]>;
  getUploadedFilesById(id: string): Promise<UploadedFiles[]>;
}

/**
 * UploadedfilesServiceImpl is a service for file related activities.
 */
@injectable()
export class UploadedfilesServiceImpl implements UploadedfilesService {

  constructor(
    @inject(Types.UploadedFilesRepository) private uploadedfilesRepository: UploadedfilesRepository
  ) {}

  /**
   * This method saves multiple uploaded file information on to the db
   * @param {UploadedFiles[]} uploadedfiles
   * @returns {Promise<string>}
   */
  public async save(uploadedfiles: UploadedFiles[]): Promise<UploadedFiles[]> {
    let created: UploadedFiles[];
    try {
      created= await this.uploadedfilesRepository.saveArray(uploadedfiles);

      // if(created.length > 0)  {
      //   message = MESSAGES.FILES_UPDATED_SUCCESSFULLY;
      // } else {
      //   message = MESSAGES.SOMETHING_WENT_WRONG;
      // }
    } catch (e) {
      logger.error(e)
    }
    return created;
  }

  /**
   * This method gets the saved files by user_id
   * @param {string} id
   * @returns {Promise<UploadedFiles[]>}
   */
  public async getUploadedFilesById(id: string): Promise<UploadedFiles[]> {
    let uploadedFiles: UploadedFiles[];
    try {
      uploadedFiles = await this.uploadedfilesRepository.findManyUsingWhere({where: {user_id: id}});
    } catch (e) {
     logger.error(e);
    }
    return uploadedFiles;
  }

}

