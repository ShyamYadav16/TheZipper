import express, { Application, Request, Response, NextFunction } from 'express';
import { createConnection } from "typeorm";
import errorHandler from 'errorhandler';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

import { dbOptions } from './config/db';
import { ENVIRONMENT } from './utils/secrets';
import {RegisterableController} from "./controller/RegisterableController";
import {container} from "./config/inversify";
import Types from './config/types';
import {Error} from "tslint/lib/error";
import { logger } from './utils/logger';

import { NotFound, BadRequest, Unauthorize, Conflict } from './utils/exceptions';
import { notFoundResponse, badRequestResponse, unauthorizeResponse, conflictResponse, internalResponse } from './utils/response';

export default class App {

  private async init() {

    await createConnection(dbOptions);

    const app: Application = express();
    app.set('port', process.env.PORT || 3000);

    app.use(errorHandler());
    app.use(compression()); // The middleware will attempt to compress response bodies for all request
    app.use(helmet()); // Helps you secure your Express apps by setting various HTTP headers
    app.use(morgan(ENVIRONMENT === 'production' ? 'combined' : 'dev')); //
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const controllers: RegisterableController[] = container.getAll<RegisterableController>(Types.Controller);
    controllers.forEach(controller => controller.register(app));

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      logger.error(err.stack);
      if (err instanceof NotFound) {
        return notFoundResponse(res, err.message);
      }
      if (err instanceof BadRequest) {
        return badRequestResponse(res, err.message);
      }
      if (err instanceof Unauthorize) {
        return unauthorizeResponse(res, err.message);
      }
      if (err instanceof Conflict) {
        return conflictResponse(res, err.message);
      }
      return internalResponse(res);
    });

    return Promise.resolve(app);
  }

  public async start() {
    const app = await this.init();
    const server = app.listen(app.get('port'), async () => {
      console.log(`Service running at port ${app.get('port')} in ${app.get('env')} mode`);
      console.log('Date: ', new Date());
    });

    return Promise.resolve(server);
  }

}