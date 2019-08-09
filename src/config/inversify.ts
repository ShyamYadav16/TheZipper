import { Container } from "inversify";
import { RegisterableController } from "../controller/RegisterableController";
import Types from './types';
import ZipController from "../controller/ZipController";

const container: Container = new Container();

// Controllers
container.bind<RegisterableController>(Types.Controller).to(ZipController);

export { container };