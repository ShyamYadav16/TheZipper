export const Types = {

  Controller: Symbol('Controller'),

  UserRepository: Symbol('UserRepository'),

  UserService: Symbol('UserService'),

  UploadedFilesRepository: Symbol('UploadedfilesRepository'),

  UploadedFilesService: Symbol('UploadedfilesService')

};

// API constants
export const API_URL = {
  UPLOAD_FILES : "/uploadFiles",
  DOWNLOAD_FILES : "/downloadZip"
}


// Message constants
export const MESSAGES = {
  FILES_UPDATED_SUCCESSFULLY: "Files were successfully uploaded!",
  SOMETHING_WENT_WRONG: "Something went wrong in the server, please check the logs for error",
  PLEASE_EXECUTE_THE_API: "Please execute GET request using /downloadZip/:id, with parameter id:",
  TO_DOWNLOAD_ZIP_FILE: "to download zip file",
  FILES_NOT_FOUND: "Files not found for the id",
  PLEASE_UPLOAD_FILES: "Please upload files."
};

// Folder Names
export const FOLDER_NAMES = {
  UPLOAD: "uploads/"
}