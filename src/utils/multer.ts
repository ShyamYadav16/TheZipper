import {Request} from "express";
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, "uploads/");
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, Date.now().toString() + "-" + file.originalname);
  }
});

export const upload = multer({ storage: storage });