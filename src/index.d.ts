import { QueryParamsType } from './types';

declare global {
  declare namespace Express {
    export interface Request {
      searchParams: QueryParamsType | null;
    }
  }
}
