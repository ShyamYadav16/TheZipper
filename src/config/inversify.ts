import {Container} from "inversify";
import {RegisterableController} from "../controller/RegisterableController";
import {Types}from './types';
import {UserService, UserServiceImpl} from "../service/userService";
import {UserRepository} from "../repository/userRepository";
import ZipperController from "../controller/ZipperController";
import {UploadedfilesService, UploadedfilesServiceImpl} from "../service/uploadedfilesService";
import {UploadedfilesRepository} from "../repository/uploadedfilesRepository";
import {UserBuilder, UserBuilderImpl} from "../builder/userBuilder";
import {UploadedfilesBuilder, UploadedfilesBuilderImpl} from "../builder/uploadedfilesBuilder";

const container: Container = new Container();

// Controllers
container.bind<RegisterableController>(Types.Controller).to(ZipperController);

// Services
container.bind<UserService>(Types.UserService).to(UserServiceImpl).inSingletonScope();
container.bind<UploadedfilesService>(Types.UploadedFilesService).to(UploadedfilesServiceImpl).inSingletonScope();

// Repositories
container.bind<UserRepository>(Types.UserRepository).to(UserRepository).inSingletonScope();
container.bind<UploadedfilesRepository>(Types.UploadedFilesRepository).to(UploadedfilesRepository).inSingletonScope();

// Builder
container.bind<UserBuilder>(Types.UserBuilder).to(UserBuilderImpl).inSingletonScope();
container.bind<UploadedfilesBuilder>(Types.UploadedfilesBuilder).to(UploadedfilesBuilderImpl).inSingletonScope();

export { container };