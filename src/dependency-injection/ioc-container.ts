import 'reflect-metadata';
import { Container } from 'inversify';
import { AppService } from '../application/services/app.service';
import { AppQueryRepo } from '../infrastructure/repositories/app-query.repo';
import { AppCommandRepo } from '../infrastructure/repositories/app-command.repo';

export const container = new Container();

container.bind<AppService>(AppService).to(AppService);
container.bind<AppCommandRepo>(AppCommandRepo).to(AppCommandRepo);
container.bind<AppQueryRepo>(AppQueryRepo).to(AppQueryRepo);

export const appService = container.get<AppService>(AppService);
export const appQueryRepo = container.get<AppQueryRepo>(AppQueryRepo);
