import { Request, Response, Router } from 'express';
import {
  checkDays,
  checkFirstDate,
  checkLessonsCountOrLastDate,
  checkTeacherIds,
  checkTitle,
  errorsValidation,
} from '../middlewares/input-validation.middlewares';
import { appService } from '../../dependency-injection/ioc-container';

export const appRouter = Router({});

appRouter.get('/', async (req: Request, res: Response) => {
  return res.sendStatus(200);
});
appRouter.post(
  '/lessons',
  checkTeacherIds,
  checkTitle,
  checkDays,
  checkFirstDate,
  checkLessonsCountOrLastDate,
  errorsValidation,
  async (req: Request, res: Response) => {
    console.log(
      await appService.createLessons({
        teacherIds: req.body.teacherIds,
        title: req.body.title,
        days: req.body.days,
        firstDate: req.body.firstDate,
        lastDate: req.body.lastDate,
        lessonsCount: req.body.lessonsCount,
      }),
    );
    return res.sendStatus(201);
  },
);
