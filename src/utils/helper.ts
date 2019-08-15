import fs from "fs";
import {logger} from "./logger";
import {MESSAGES} from "../config/types";
import archiver from "archiver";
import {Response} from "express";
import path from "path";
import {validate, ValidationError} from "class-validator";

/**
 * This method validates the entity and throws an error if there is any.
 * @param entity
 * @returns {Promise<void>}
 */
export const validation = async (entity: any) => {
  const errors: ValidationError[] = await validate(entity);

  if(errors.length > 0) {
    throw errors;
  }
}

/**
 * This method receives the files and returns the zip file.
 * @param {string[]} files
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
export const zipFiles = async (files: string[], res: Response) => {
  const archive = archiver("zip");

  archive.on("error", (err) => {
    res.status(500).send({error: err.message});
  });

  //on stream closed we can end the request
  archive.on('end', () => {
    logger.info('Archive wrote %d bytes', archive.pointer());
  });

  //set the archive name
  res.attachment('archive.zip');

  //this is the streaming magic
  archive.pipe(res);

  for(let i in files) {
    archive.file(files[i], { name: path.basename(files[i]) });
  }

  await archive.finalize();
}

/**
 * This method receives the path of the file and deletes them
 * @param {string} path
 * @returns {Promise<any>}
 */
export const deleteFile = (path: string) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        logger.error(err);
        reject(err);
      }
      logger.info(`Successfully deleted file ${path}`);
      resolve(MESSAGES.SUCCESS);
    })
  })
}
