import { NextFunction, Request, Response } from 'express';
import {
  body,
  CustomValidator,
  Result,
  validationResult,
} from 'express-validator';

export type ErrorsMessagesType = {
  message: string;
  field: string;
};
export type ErrorsType = {
  errorsMessages: ErrorsMessagesType[];
};

const errors: ErrorsType = { errorsMessages: [] };
export const checkLessonsCountOrLastDate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const lessonsCount = req.body.lessonsCount || null;
  const lastDate = req.body.lastDate || null;
  console.log(lessonsCount);
  console.log(lastDate);
  if (lessonsCount && lastDate) {
    errors.errorsMessages.push({
      message: "lastDate and lessonsCount can't be together",
      field: 'lessonsCount and lastDate',
    });
  } else if (!lessonsCount && !lastDate) {
    errors.errorsMessages.push({
      message: 'lastDate or lessonsCount must be',
      field: 'lessonsCount and lastDate',
    });
  } else if (lessonsCount) {
    const result = Number(lessonsCount);
    if (isNaN(result) || result > 300 || result < 1)
      errors.errorsMessages.push({
        message: 'lessonsCount must be number 0..300',
        field: 'lessonsCount',
      });
    req.body.lessonsCount = result;
  } else if (lastDate) {
    const result = Date.parse(lastDate);
    if (isNaN(result) || result < Date.now())
      errors.errorsMessages.push({
        message: 'lastDate must be Date',
        field: 'lastDate',
      });
    req.body.lastDate = result;
  }
  return next();
};
const checkDaysValues: CustomValidator = async (days: number[]) => {
  const arr = [0, 1, 2, 3, 4, 5, 6];
  let exist = true;
  let i = 0;
  while (exist && i < days.length) {
    exist = arr.includes(days[i]);
    i++;
  }
  if (exist && days.length === new Set(days).size) return true;
  else throw new Error('Days values is not uniq');
};
export const checkFirstDate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const firstDate = req.body.firstDate || null;
  const result = Date.parse(firstDate);
  if (isNaN(result) || result < Date.now())
    errors.errorsMessages.push({
      message: 'firstDate must be Date',
      field: 'firstDate',
    });
  req.body.firstDate = result;
  return next();
};

export const checkTeachersId = body('teachersId').isArray({ min: 1, max: 5 });
export const checkTitle = body('title')
  .trim()
  .isString()
  .isLength({ min: 1, max: 100 });
export const checkDays = body('days')
  .isArray({ min: 1, max: 7 })
  .custom(checkDaysValues);
/*export const checkFirstDate = body('firstDate')
  .trim()
  .isDate({ format: 'YYYY-MM-DD' })
  .toDate();*/
export const errorsValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result: Result = validationResult(req);
  for (
    let i = 0;
    i < validationResult(req).array({ onlyFirstError: true }).length;
    i++
  ) {
    errors.errorsMessages.push({
      message: result.array({ onlyFirstError: true })[i].msg,
      field: result.array({ onlyFirstError: true })[i].path,
    });
  }
  if (errors.errorsMessages.length) {
    const temp = { ...errors, errorsMessages: [...errors.errorsMessages] };
    errors.errorsMessages = [];
    return res.status(400).json(temp);
  } else {
    return next();
  }
};
