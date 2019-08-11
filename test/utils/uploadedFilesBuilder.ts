import {UploadedFiles} from "../../src/entity/uploadedfiles";
import {getRepository} from "typeorm";
import {UploadedfilesRepository} from "../../src/repository/uploadedfilesRepository";
import UserTestBuilder from "./userTestBuilder";

export default class UploadedFilesBuilder {

  private uploadedFiles: UploadedFiles = new UploadedFiles();

  public static newUploadedFiles() {
    return new UploadedFilesBuilder();
  }

  public withId(id: number): UploadedFilesBuilder {
    this.uploadedFiles.id = id;
    return this;
  }

  public withUserId(user_id: number): UploadedFilesBuilder {
    this.uploadedFiles.user_id = user_id;
    return this;
  }

  public withFileName(fileName: string): UploadedFilesBuilder {
    this.uploadedFiles.fileName = fileName;
    return this;
  }

  public withDefaultValues(id: number, user_id: number, fileName: string): UploadedFilesBuilder {
    return this.withId(id).withUserId(user_id).withFileName(fileName);
  }

  public build(): UploadedFiles {
    return this.uploadedFiles;
  }

  public static createUploadedfiles() {
    return UploadedFilesBuilder.newUploadedFiles().withDefaultValues(1, 1, "abc.txt").build();
  }

  public static createListOfDefaultUploadedFiles(size: number) {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(UploadedFilesBuilder.newUploadedFiles().withDefaultValues(i, 1, `abc${i}.txt`).build());
    }
    return result;
  }

  public static getMock(size: number) {
    const Mock = jest.fn<UploadedfilesRepository, []>(() => ({
      findManyUsingWhere: jest.fn().mockReturnValue(this.createListOfDefaultUploadedFiles(size)),
      save: jest.fn().mockReturnValue(this.createUploadedfiles()),
      saveArray: jest.fn().mockReturnValue(this.createListOfDefaultUploadedFiles(size)),
      repository: getRepository(UploadedFiles)
    }));
    return new Mock();
  }

}