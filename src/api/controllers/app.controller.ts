import { Request, Response, Router } from 'express';
import { errorsValidation } from '../middlewares/input-validation.middlewares';
import { body } from 'express-validator';

export const appRouter = Router({});

appRouter.get('/', async (req: Request, res: Response) => {
  return res.sendStatus(200);
});
appRouter.post(
  '/lessons',
  body(['lessonsCount', 'lastDate']).notEmpty(),
  /*checkLessonsCountOrLastDate,*/
  errorsValidation,
  async (req: Request, res: Response) => {
    return res.sendStatus(201);
  },
);
