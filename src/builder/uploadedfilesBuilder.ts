import {inject, injectable} from "inversify";
import {UploadedfilesRepository} from "../repository/uploadedfilesRepository";
import {FOLDER_NAMES, MESSAGES, Types} from "../config/types";
import {UploadedFiles} from "../entity/uploadedfiles";
import {validation, zipFiles} from "../utils/helper";
import {Response} from "express";
import path from "path";

export interface UploadedfilesBuilder {
  with(fileNames: string[], user_id: number): Promise<UploadedfilesBuilder>;
  build(): Promise<UploadedFiles[]>;
  download(): void;
  withId(user_id: string, res: Response): UploadedfilesBuilder;
  getId(): string;
}

/**
 * UploadedfilesBuilder helps in building uploaded files data and download zip
 */
@injectable()
export class UploadedfilesBuilderImpl implements UploadedfilesBuilder {

  constructor(
    @inject(Types.UploadedFilesRepository) private uploadedfilesRepository: UploadedfilesRepository
  ) {}

  private uploadedFiles: UploadedFiles[] = [];

  private user_id: string;
  private res: Response;

  /**
   * Builder method to hold array of uploaded files by taking fileNames and user_id
   * @param {string[]} fileNames
   * @param {number} user_id
   * @returns {Promise<UploadedfilesBuilder>}
   */
  public async with(fileNames: string[], user_id: number): Promise<UploadedfilesBuilder> {
    fileNames.forEach((fileName) => {
      const uploadedFile = new UploadedFiles(fileName, user_id);
      validation(uploadedFile);
      this.uploadedFiles.push(uploadedFile);
    });
    return this;
  }

  /**
   * Builder method to save array of uploadedFiles into uploadedfiles table
   * @returns {Promise<UploadedFiles[]>}
   */
  public async build(): Promise<UploadedFiles[]> {
    return await this.uploadedfilesRepository.saveArray(this.uploadedFiles);
  }

  /**
   * Builder method to hold user_id and response object
   * @param {string} user_id
   * @param {e.Response} res
   * @returns {UploadedfilesBuilder}
   */
  public withId(user_id: string, res: Response): UploadedfilesBuilder {
    this.user_id = user_id;
    this.res = res;
    return this;
  }

  /**
   * Builder method to retrieve user_id
   * @returns {string}
   */
  public getId(): string {
    return this.user_id;
  }

  /**
   * Builder method to download zip file
   * @returns {Promise<void>}
   */
  public async download() {
    const uploadedFiles: UploadedFiles[] = await this.uploadedfilesRepository.findManyUsingWhere({where: {user_id: this.user_id}});

    // If files are not found send a file not message to the client
    if(uploadedFiles.length === 0) {
      throw new Error(`${MESSAGES.FILES_NOT_FOUND} ${this.user_id}`);
    }

    let files: string[] = [];

    let uploadFolder: string = `${path.resolve(`./${FOLDER_NAMES.UPLOAD}`)}/`;

    uploadedFiles.forEach((file: UploadedFiles) => {
      files.push(`${uploadFolder}${file.fileName}`);
    });

    await zipFiles(files, this.res);
  }

}