import {RegisterableController} from "./RegisterableController";
import {Application, NextFunction, Request, Response} from "express";
import {dataResponse} from "../utils/response";
import {inject, injectable} from "inversify";
import archiver from "archiver";
import p from "path";
import {upload} from "../utils/multer";
import {User} from "../entity/user";
import {UploadedFiles} from "../entity/uploadedfiles";
import {UserService} from "../service/userService";
import Types from "../config/types";
import {UploadedfilesService} from "../service/uploadedfilesService";
import {logger} from "../utils/logger";

@injectable()
export class ZipperController implements RegisterableController {

  @inject(Types.UserService)
  private userService: UserService;

  @inject(Types.UploadedFilesService)
  private uploadedfilesService: UploadedfilesService;

  public register(app: Application): void {

    app.route('/downloadZip')
      .get( async (req: Request, res: Response, next: NextFunction) => {
        const archive = archiver("zip");

        try {
          archive.on("error", (err) => {
            res.status(500).send({error: err.message});
          });

          //on stream closed we can end the request
          archive.on('end', () => {
            console.log('Archive wrote %d bytes', archive.pointer());
          });

          //set the archive name
          res.attachment('archive-name.zip');

          //this is the streaming magic
          archive.pipe(res);

          const files = ["", ""];

          for(let i in files) {
            archive.file(files[i], { name: p.basename(files[i]) });
          }

          var directories = ['']

          for(let i in directories) {
            archive.directory(directories[i], directories[i].replace('', ''));
          }

          const finalArchive = await archive.finalize();

          console.log(finalArchive);
        } catch (e) {
          return next(e);
        }
      });

    app.route('/uploadFiles')
      .post(upload.array('file', 5), async (req: Request, res: Response, next: NextFunction) => {
        try {
          const fileInfo: any = req.files;
          const body: User = req.body;

          const user: User = new User();
          user.userName = body.userName;
          user.uploadedfiles = [];

          const created: User = await this.userService.save(user);

          for (let fileInfoKey in fileInfo) {
            const uploadedFiles: UploadedFiles = new UploadedFiles();
            uploadedFiles.fileName = fileInfo[fileInfoKey].filename;
            uploadedFiles.user_id = created.id;
            user.uploadedfiles.push(uploadedFiles)
          }

          const message: string = await this.uploadedfilesService.save(user.uploadedfiles);

          return dataResponse(res, message);
        } catch (e) {
          return next(e);
        }
      });

  }

}

export default ZipperController;