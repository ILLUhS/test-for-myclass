import { NextFunction, Request, Response } from 'express';
import { Result, validationResult } from 'express-validator';

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
    //throw new Error("lastDate and lessonsCount can't be together");
  }
  return next();
};
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
