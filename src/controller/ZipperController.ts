import {RegisterableController} from "./RegisterableController";
import {Application, NextFunction, Request, Response} from "express";
import {badRequestResponse, badRequestValidationResponse, dataResponse} from "../utils/response";
import {inject, injectable} from "inversify";
import archiver from "archiver";
import p from "path";
import {upload} from "../utils/multer";
import {User} from "../entity/user";
import {UploadedFiles} from "../entity/uploadedfiles";
import {UserService} from "../service/userService";
import {API_URL, FOLDER_NAMES, MESSAGES, Types} from "../config/types";
import {UploadedfilesService} from "../service/uploadedfilesService";
import path from "path";
import { validate, ValidationError } from 'class-validator';
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
     * downloadFiles API receives a parameter id and gets the file names that
     * belongs to this id, zip these files and send that the zip file on to
     * the client
     */
    app.route(`${API_URL.DOWNLOAD_FILES}/:id`)
      .get( async (req: Request, res: Response, next: NextFunction) => {
        const archive = archiver("zip");
        const id: string = req.params.id;

        try {
          const uploadedFiles: UploadedFiles[] = await this.uploadedfilesService.getUploadedFilesById(id);

          // If files are not found send a file not message to the client
          if(uploadedFiles.length === 0) {
            return dataResponse(res, `${MESSAGES.FILES_NOT_FOUND} ${id}`);
          }

          let files: string[] = [];

          let uploadFolder: string = `${path.resolve(`./${FOLDER_NAMES.UPLOAD}`)}/`;

          uploadedFiles.forEach((file: UploadedFiles) => {
            files.push(`${uploadFolder}${file.fileName}`);
          });

          archive.on("error", (err) => {
            res.status(500).send({error: err.message});
          });

          //on stream closed we can end the request
          archive.on('end', () => {
            console.log('Archive wrote %d bytes', archive.pointer());
          });

          //set the archive name
          res.attachment('archive.zip');

          //this is the streaming magic
          archive.pipe(res);

          for(let i in files) {
            archive.file(files[i], { name: p.basename(files[i]) });
          }

          var directories = [`${uploadFolder}zipfiles`]

          for(let i in directories) {
            archive.directory(directories[i], directories[i].replace(`${uploadFolder}`, ''));
          }

          await archive.finalize();

        } catch (e) {
          return next(e);
        }
      });

    /**
     * uploadFiles API uploads the files on to uploads folder and also creates an entry
     * in the db with user information.
     */
    app.route(API_URL.UPLOAD_FILES)
      .post(upload.array('file', 5), async (req: Request, res: Response, next: NextFunction) => {
        try {
          const fileInfo: any = req.files;
          const body: User = req.body;

          const user: User = new User();
          user.userName = body.userName;
          user.uploadedfiles = [];

          // validate user entity
          const errors: ValidationError[] = await validate(user); // errors is an array of validation errors

          if(errors.length > 0) {
            // return BAD REQUEST status code and errors array
            logger.error(errors);
            return badRequestValidationResponse(res, errors);
          } else if (fileInfo.length === 0) {
            logger.error(`Error: ${MESSAGES.PLEASE_UPLOAD_FILES}`);
            return badRequestResponse(res, MESSAGES.PLEASE_UPLOAD_FILES);
          }

          const created: User = await this.userService.save(user);

          for (let fileInfoKey in fileInfo) {
            const uploadedFiles: UploadedFiles = new UploadedFiles();
            uploadedFiles.fileName = fileInfo[fileInfoKey].filename;
            uploadedFiles.user_id = created.id;
            user.uploadedfiles.push(uploadedFiles)
          }

          const uf: UploadedFiles[] = await this.uploadedfilesService.save(user.uploadedfiles);

          if(uf.length > 0) {
            return dataResponse(res, `${MESSAGES.PLEASE_EXECUTE_THE_API} ${user.id} ${MESSAGES.TO_DOWNLOAD_ZIP_FILE}`);
          }
          return dataResponse(res, `${MESSAGES.SOMETHING_WENT_WRONG}`);
        } catch (e) {
          return next(e);
        }
      });

  }

}

export default ZipperController;