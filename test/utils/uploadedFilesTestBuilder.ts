import {UploadedFiles} from "../../src/entity/uploadedfiles";
import {getRepository} from "typeorm";
import {UploadedfilesRepository} from "../../src/repository/uploadedfilesRepository";
import {UploadedfilesBuilder, UploadedfilesBuilderImpl} from "../../src/builder/uploadedfilesBuilder";

export default class UploadedFilesTestBuilder {

  private uploadedFiles: UploadedFiles = new UploadedFiles("abc.txt", 1);

  public static newUploadedFiles() {
    return new UploadedFilesTestBuilder();
  }

  public withId(id: number): UploadedFilesTestBuilder {
    this.uploadedFiles.id = id;
    return this;
  }

  public withUserId(user_id: number): UploadedFilesTestBuilder {
    this.uploadedFiles.user_id = user_id;
    return this;
  }

  public withFileName(fileName: string): UploadedFilesTestBuilder {
    this.uploadedFiles.fileName = fileName;
    return this;
  }

  public withCreated(created: Date): UploadedFilesTestBuilder {
    this.uploadedFiles.created = created;
    return this;
  }

  public withDefaultValues(id: number, user_id: number, fileName: string, created: Date): UploadedFilesTestBuilder {
    return this.withId(id).withUserId(user_id).withFileName(fileName).withCreated(created);
  }

  public build(): UploadedFiles {
    return this.uploadedFiles;
  }

  public static createUploadedfiles() {
    return UploadedFilesTestBuilder.newUploadedFiles().withDefaultValues(1, 1, "abc.txt", new Date()).build();
  }

  public static createListOfDefaultUploadedFiles(size: number) {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(UploadedFilesTestBuilder.newUploadedFiles().withDefaultValues(i, 1, `abc${i}.txt`, new Date()).build());
    }
    return result;
  }

  public static getMockRepo(size: number) {
    const Mock = jest.fn<UploadedfilesRepository, []>(() => ({
      findManyUsingWhere: jest.fn().mockReturnValue(this.createListOfDefaultUploadedFiles(size)),
      save: jest.fn().mockReturnValue(this.createUploadedfiles()),
      saveArray: jest.fn().mockReturnValue(this.createListOfDefaultUploadedFiles(size)),
      repository: getRepository(UploadedFiles)
    }));
    return new Mock();
  }

  public static getMockBuilder() {
    const Mock = jest.fn<UploadedfilesBuilder, []>(() => ({
      with: jest.fn().mockReturnValue(new UploadedfilesBuilderImpl(this.getMockRepo(2))),
      build: jest.fn().mockReturnValue(this.createListOfDefaultUploadedFiles(2)),
      withId: jest.fn().mockReturnValue(new UploadedfilesBuilderImpl(this.getMockRepo(2))),
      getId: jest.fn().mockReturnValue(1),
      download: jest.fn()
    }));
    return new Mock();
  }

}