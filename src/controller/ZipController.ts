import {RegisterableController} from "./RegisterableController";
import {Application, Request, Response} from "express";
import {dataResponse} from "../utils/response";
import {injectable} from "inversify";

@injectable()
export class ZipController implements RegisterableController {

  public register(app: Application): void {

    app.route('/hello')
      .get( async (req: Request, res: Response) => {
        try {
          return dataResponse(res,"Hello World");
        } catch (e) {
          console.log(e);
        }
      });

  }

}

export default ZipController;