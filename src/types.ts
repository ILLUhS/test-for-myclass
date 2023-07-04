export type ErrorsMessagesType = {
  message: string;
  field: string;
};
export type ErrorsType = {
  errorsMessages: ErrorsMessagesType[];
};
export type LessonCreateDtoType = {
  teacherIds: number[];
  title: string;
  days: number[];
  firstDate: Date;
  lessonsCount?: number;
  lastDate?: Date;
};
export type QueryParamsType = {
  date: Date[] | null;
  status: number | null;
  teacherIds: number[] | null;
  studentsCount: number | null;
  page: number;
  lessonsPerPage: number;
};
