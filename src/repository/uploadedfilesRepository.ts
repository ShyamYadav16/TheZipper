import { injectable } from 'inversify';
import { GenericRepositoryImp } from './repository';
import { getRepository } from 'typeorm';
import { UploadedFiles } from '../entity/uploadedfiles';

@injectable()
export class UploadedfilesRepository extends GenericRepositoryImp<UploadedFiles> {

  constructor() {
    super(getRepository(UploadedFiles));
  }
}