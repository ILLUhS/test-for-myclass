import { Request, Response, Router } from 'express';
import {
  checkLessonsCountOrLastDate,
  errorsValidation,
  teachersIdIsValid,
} from '../middlewares/input-validation.middlewares';

export const appRouter = Router({});

appRouter.get('/', async (req: Request, res: Response) => {
  return res.sendStatus(200);
});
appRouter.post(
  '/lessons',
  teachersIdIsValid,
  /*body(['lessonsCount', 'lastDate']).notEmpty(),*/
  checkLessonsCountOrLastDate,
  errorsValidation,
  async (req: Request, res: Response) => {
    return res.sendStatus(201);
  },
);
