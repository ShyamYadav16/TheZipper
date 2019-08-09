import { Application } from 'express';

export interface RegisterableController {
  register(app: Application): void;
}