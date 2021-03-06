import { ConnectionOptions } from 'typeorm';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_LOGGING, DB_SYNCHRONIZE, DB_DROP_SCHEMA, ENVIRONMENT } from '../utils/secrets';
import { User } from '../entity/user';
import {UploadedFiles} from "../entity/uploadedfiles";

export const dbOptions: ConnectionOptions = {
  type: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [
    User, UploadedFiles
  ],
  logging: DB_LOGGING,
  synchronize: DB_SYNCHRONIZE,
  dropSchema: DB_DROP_SCHEMA
};