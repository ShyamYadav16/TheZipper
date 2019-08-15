import * as cron from 'node-cron';
import {logger} from "../utils/logger";
import {UploadedFiles} from "../entity/uploadedfiles";
import {getManager, Repository} from "typeorm";
import {deleteFile} from "../utils/helper";
import {FOLDER_NAMES, MESSAGES} from "../config/types";
import path from "path";

export default class Jobs {

  /**
   * Retrieves the files with deleted flag 0 and deletes them, when its called
   * @returns {Promise<void>}
   */
  public static async deleteFiles() {
    try {
      const uploadedFilesRepository: Repository<UploadedFiles> = getManager().getRepository(UploadedFiles);
      const uploadedFiles = await uploadedFilesRepository.query(`SELECT * FROM uploadedfiles WHERE deleted=0`);
      let uploadFolder: string = `${path.resolve(`./${FOLDER_NAMES.UPLOAD}`)}/`;

      if(uploadedFiles && uploadedFiles.length > 0) {
        const fileNames: string[] = uploadedFiles.map((u: UploadedFiles) => u.fileName);

        fileNames.forEach(async (fileName) => {
          let message: any = await deleteFile(`${uploadFolder}${fileName}`);
          if (message === MESSAGES.SUCCESS) {
            await uploadedFilesRepository.query(`UPDATE uploadedfiles SET deleted=1 WHERE fileName='${fileName}'`)
          }

        });
      }
    } catch (e) {
      logger.error(e);
    }
  }

  /**
   * Schedules the cron job to delete files
   */
  public static scheduleJob() {
    cron.schedule(MESSAGES.CRON_CONFIG, () => {
      Jobs.deleteFiles();
    });
  }

}