export type ErrorsMessagesType = {
  message: string;
  field: string;
};
export type ErrorsType = {
  errorsMessages: ErrorsMessagesType[];
};
export type LessonCreateDto = {
  teacherIds: number[];
  title: string;
  days: number[];
  firstDate: string;
  lessonsCount?: number;
  lastDate?: string;
};
