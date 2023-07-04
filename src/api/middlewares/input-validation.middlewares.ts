import { NextFunction, Request, Response } from 'express';
import {
  body,
  CustomValidator,
  Result,
  validationResult,
} from 'express-validator';
import { ErrorsType } from '../../types';

const errors: ErrorsType = { errorsMessages: [] };
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
    if (!result || new Date(result[0]) < new Date())
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
  .isNumeric();
export const checkTitle = body('title')
  .trim()
  .isString()
  .isLength({ min: 1, max: 100 });
export const checkDays = body('days')
  .isArray({ min: 1, max: 7 })
  .custom(checkDaysValues);
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

export const checkQueryParams = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let date = req.query.date || null;
  const status = req.query.status || null;
  const teacherIds = req.query.teacherIds || null;
  const studentsCount = req.query.studentsCount || null;
  const page = req.query.page || 1;
  const lessonsPerPage = req.query.lessonsPerPage || 5;
  console.log({
    date,
    status,
    teacherIds,
    studentsCount,
    page,
    lessonsPerPage,
  });
  if (typeof date === 'string') {
    date = date.split(',');
    if (date.length <= 2) {
      date.forEach((d) => {
        const result = Date.parse(d);
        if (isNaN(result) || result < Date.now())
          errors.errorsMessages.push({
            message: 'lastDate must be Date',
            field: 'lastDate',
          });
      });
    }
  }
  /*const params: QueryParamsType = {
    searchNameTerm: String(searchNameTerm),
    searchLoginTerm: String(searchLoginTerm),
    searchEmailTerm: String(searchEmailTerm),
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
    sortBy: String(sortBy),
    sortDirection: sortDirection,
  };
  if (params.pageNumber < 1) return res.status(400).send('Invalid pageNumber');
  if (params.pageSize < 1) return res.status(400).send('Invalid pageSize');
  req.searchParams = params;*/
  return next();
};
