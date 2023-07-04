import { Request, Response, Router } from 'express';
import {
  checkDate,
  checkDays,
  checkFirstDate,
  checkLessonsCountOrLastDate,
  checkLessonsPerPage,
  checkPage,
  checkQueryTeacherIds,
  checkStatus,
  checkStudentsCount,
  checkTeacherIds,
  checkTitle,
  errorsValidation,
} from '../middlewares/input-validation.middlewares';
import {
  appQueryRepo,
  appService,
} from '../../dependency-injection/ioc-container';
import { QueryParamsType } from '../../types';

export const appRouter = Router({});

appRouter.get(
  '/',
  checkPage,
  checkLessonsPerPage,
  checkDate,
  checkStatus,
  checkStudentsCount,
  checkQueryTeacherIds,
  errorsValidation,
  async (req: Request, res: Response) => {
    const searchParams: QueryParamsType = {
      date: req.query.date,
      teacherIds: req.query.teacherIds,
      status: req.query.status,
      studentsCount: req.query.studentsCount,
      page: req.query.page,
      lessonsPerPage: req.query.lessonsPerPage,
    };
    return res.status(200).json(appQueryRepo.getLessons(searchParams));
  },
);
appRouter.post(
  '/lessons',
  checkTeacherIds,
  checkTitle,
  checkDays,
  checkFirstDate,
  checkLessonsCountOrLastDate,
  errorsValidation,
  async (req: Request, res: Response) => {
    const result = await appService.createLessons({
      teacherIds: req.body.teacherIds,
      title: req.body.title,
      days: req.body.days,
      firstDate: req.body.firstDate,
      lastDate: req.body.lastDate,
      lessonsCount: req.body.lessonsCount,
    });
    if (!result)
      return res.status(400).json({
        errorsMessages: [
          {
            message: 'teacherIds or interval date invalid',
            field: 'teacherIds or lastDate',
          },
        ],
      });
    return res.status(201).json(result);
  },
);
