import { NextFunction, Request, Response } from 'express';
import {
  body,
  CustomSanitizer,
  CustomValidator,
  query,
  Result,
  validationResult,
} from 'express-validator';
import { ErrorsType } from '../../types';
import { appService } from '../../dependency-injection/ioc-container';

const errors: ErrorsType = { errorsMessages: [] };

const checkTeacherIdsIsExist: CustomValidator = async (
  teacherIds: number[],
) => {
  if (await appService.teacherByIds(teacherIds)) return true;
  else throw new Error("some of teacherByIds don't exist");
};
const toIntArray: CustomSanitizer = async (value) => {
  return String(value)
    .split(',')
    .map((v) => Number(v));
};
//body validation
export const checkLessonsCountOrLastDate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const lessonsCount = req.body.lessonsCount || null;
  const lastDate = req.body.lastDate || null;
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
    else req.body.lessonsCount = result;
  } else if (lastDate) {
    const result = lastDate
      .trim()
      .match(
        /(19|20)\d\d-((0[1-9]|1[012])-(0[1-9]|[12]\d)|(0[13-9]|1[012])-30|(0[13578]|1[02])-31)/g,
      );
    if (!result || result.length > 1 || new Date(result[0]) < new Date())
      errors.errorsMessages.push({
        message: 'lastDate must be Date',
        field: 'lastDate',
      });
    else req.body.lastDate = new Date(lastDate);
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
const checkDateIsNotPast: CustomValidator = async (date: Date) => {
  if (date < new Date()) throw new Error('Date is invalid');
  return true;
};
export const checkFirstDate = body('firstDate')
  .trim()
  .matches(
    /(19|20)\d\d-((0[1-9]|1[012])-(0[1-9]|[12]\d)|(0[13-9]|1[012])-30|(0[13578]|1[02])-31)/g,
  )
  .toDate()
  .custom(checkDateIsNotPast);
export const checkTeacherIds = body('teacherIds')
  .isArray({ min: 1, max: 5 })
  .isNumeric()
  .custom(checkTeacherIdsIsExist);
export const checkTitle = body('title')
  .trim()
  .isString()
  .isLength({ min: 1, max: 100 });
export const checkDays = body('days')
  .isArray({ min: 1, max: 7 })
  .custom(checkDaysValues);
//query validation
export const checkPage = query('page').default(1).toInt().isInt({ min: 1 });
export const checkLessonsPerPage = query('lessonsPerPage')
  .default(5)
  .toInt()
  .isInt({ min: 1 });
export const checkDate = query('date')
  .optional()
  .customSanitizer((value) => {
    const temp = String(value)
      .trim()
      .match(
        /(19|20)\d\d-((0[1-9]|1[012])-(0[1-9]|[12]\d)|(0[13-9]|1[012])-30|(0[13578]|1[02])-31)/g,
      );
    value = String(value).split(',');
    if (temp && temp.length <= 2 && temp.length === value.length) {
      return temp.map((r) => new Date(r));
    } else return null;
  })
  .isArray();
export const checkStatus = query('status').optional().isInt({ min: 0, max: 1 });
export const checkStudentsCount = query('studentsCount')
  .optional()
  .customSanitizer(toIntArray)
  .isArray({ max: 2 })
  .isNumeric();
export const checkQueryTeacherIds = query('teacherIds')
  .optional()
  .customSanitizer(toIntArray)
  .isArray({ max: 10 })
  .isNumeric()
  .custom(checkTeacherIdsIsExist);
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
