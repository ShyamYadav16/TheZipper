import {RegisterableController} from "./RegisterableController";
import {Application, NextFunction, Request, Response} from "express";
import {badRequestResponse, dataResponse} from "../utils/response";
import {inject, injectable} from "inversify";
import {upload} from "../utils/multer";
import {User} from "../entity/user";
import {UploadedFiles} from "../entity/uploadedfiles";
import {UserService} from "../service/userService";
import {API_URL, MESSAGES, Types} from "../config/types";
import {UploadedfilesService} from "../service/uploadedfilesService";
import {logger} from "../utils/logger";

/**
 * ZipperController is a controller class which contains API's to upload file
 * and convert these uploaded files into zip file which are then sent back to
 * the client.
 */
@injectable()
export class ZipperController implements RegisterableController {

  @inject(Types.UserService)
  private userService: UserService;

  @inject(Types.UploadedFilesService)
  private uploadedfilesService: UploadedfilesService;

  public register(app: Application): void {

    /**
     * downloadFiles API receives a parameter id and downloads the zip file based on the id
     */
    app.route(`${API_URL.DOWNLOAD_FILES}/:id`)
      .get( async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id;
        try {
          await this.uploadedfilesService.download(id, res);
        } catch (e) {
          logger.error(e);
          // Returns the error that is thrown in /downloadFiles/:id API
          return badRequestResponse(res, e);
        }
      });

    /**
     * uploadFiles API uploads the files on to uploads folder and also creates an entry
     * in the db with user information.
     */
    app.route(API_URL.UPLOAD_FILES)
      .post(upload.array('file', 7), async (req: Request, res: Response, next: NextFunction) => {
        try {
          const fileInfo: any = req.files;
          const body: User = req.body;

          // Return error is the files are not found
          if (fileInfo.length === 0) {
            logger.error(`Error: ${MESSAGES.PLEASE_UPLOAD_FILES}`);
            return badRequestResponse(res, `Error: ${MESSAGES.PLEASE_UPLOAD_FILES}`);
          }

          const user_id: number = await this.userService.save(body.userName);
          let uf: UploadedFiles[] = await this.uploadedfilesService.save(fileInfo, user_id);
          if(uf.length > 0) {
            // Returns success response with /downloadFile API info.
            return dataResponse(res, `${MESSAGES.PLEASE_EXECUTE_THE_API} ${user_id} ${MESSAGES.TO_DOWNLOAD_ZIP_FILE}`);
          }
          // Returns Error if the files are not uploaded
          return dataResponse(res, `${MESSAGES.SOMETHING_WENT_WRONG}`);
        } catch (e) {
          logger.error(e);
          // Returns the error that is thrown from inside /uploadFiles API
          return badRequestResponse(res, e);
        }
      });

  }

}

export default ZipperController;