import {Request} from "express";
import multer from 'multer';
import {FOLDER_NAMES} from "../config/types";

/**
 * Creating a storage unit on the disk and also appending the file name with
 * random number.
 * @type {multer.StorageEngine}
 */
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, FOLDER_NAMES.UPLOAD);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, Date.now().toString() + "-" + file.originalname);
  }
});

export const upload = multer({ storage: storage });