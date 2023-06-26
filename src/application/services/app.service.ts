import { inject, injectable } from 'inversify';
import { AppCommandRepo } from '../../infrastructure/repositories/app-command.repo';

@injectable()
export class AppService {
  constructor(@inject(AppCommandRepo) private appCommandRepo: AppCommandRepo) {}
}
