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
  date: Date[] | any;
  status: number | any;
  teacherIds: number[] | any;
  studentsCount: number[] | any;
  page: number | any;
  lessonsPerPage: number | any;
};
