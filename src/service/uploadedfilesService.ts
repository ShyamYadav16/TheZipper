import {UploadedFiles} from "../entity/uploadedfiles";
import {inject, injectable} from "inversify";
import {UploadedfilesRepository} from "../repository/uploadedfilesRepository";
import Types from "../config/types";
import {logger} from "../utils/logger";

export interface UploadedfilesService {
  save(uploadedfiles: UploadedFiles[]): Promise<string>;
}

@injectable()
export class UploadedfilesServiceImpl implements UploadedfilesService {

  constructor(
    @inject(Types.UploadedFilesRepository) private uploadedfilesRepository: UploadedfilesRepository
  ) {}

  public async save(uploadedfiles: UploadedFiles[]): Promise<string> {
    let message: string;
    try {
      let created = this.uploadedfilesRepository.save(uploadedfiles);
      if(created)  {
        message = "Files were successfully uploaded!";
      }
    } catch (e) {
      logger.error(e)
    }
    return message;
  }

}

