import { Request, Response, Router } from 'express';
import {
  checkLessonsCountOrLastDate,
  errorsValidation,
} from '../middlewares/input-validation.middlewares';

export const appRouter = Router({});

appRouter.get('/', async (req: Request, res: Response) => {
  return res.sendStatus(200);
});
appRouter.post(
  '/lessons',
  /*body(['lessonsCount', 'lastDate']).notEmpty(),*/
  checkLessonsCountOrLastDate,
  errorsValidation,
  async (req: Request, res: Response) => {
    return res.sendStatus(201);
  },
);
