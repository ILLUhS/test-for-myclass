import { Request, Response, Router } from 'express';
import {
  checkDays,
  checkFirstDate,
  checkLessonsCountOrLastDate,
  checkTeachersId,
  checkTitle,
  errorsValidation,
} from '../middlewares/input-validation.middlewares';

export const appRouter = Router({});

appRouter.get('/', async (req: Request, res: Response) => {
  return res.sendStatus(200);
});
appRouter.post(
  '/lessons',
  checkTeachersId,
  checkTitle,
  checkDays,
  checkFirstDate,
  /*body(['lessonsCount', 'lastDate']).notEmpty(),*/
  checkLessonsCountOrLastDate,
  errorsValidation,
  async (req: Request, res: Response) => {
    console.log(req.body.firstDate);
    return res.sendStatus(201);
  },
);
