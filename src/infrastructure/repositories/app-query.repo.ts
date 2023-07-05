import { injectable } from 'inversify';
import { client } from '../database';
import { QueryParamsType } from '../../types';
import format = require('pg-format');

@injectable()
export class AppQueryRepo {
  async getLessons(searchParams: QueryParamsType) {
    const { date, teacherIds, studentsCount, status, page, lessonsPerPage } =
      searchParams;
    let conditionDate = '';
    let conditionStatus = '';
    let conditionTeacherIds = '';
    let conditionStudentsCount = '';
    let conditionIsExist = false;
    let where = '';
    let and = '';
    if (date) {
      if (date.length > 1)
        conditionDate = `date_lesson between '${date[0]}' AND '${date[1]}'`;
      else conditionDate = `date_lesson = '${date[0]}'`;
      conditionIsExist = true;
    }
    if (status) {
      conditionStatus = `status = ${status}`;
      conditionIsExist = true;
    }
    if (date && status) and = 'AND';
    if (teacherIds)
      conditionTeacherIds = `AND lt.teacher_id=ANY('{${teacherIds}}'::int[])`;
    if (studentsCount) {
      if (studentsCount.length > 1)
        conditionStudentsCount = `HAVING SUM(sls.visit) >= ${studentsCount[0]}
        AND SUM(sls.visit) <= ${studentsCount[1]}`;
      else
        conditionStudentsCount = `HAVING SUM(sls.visit) = ${studentsCount[0]}`;
    }
    if (conditionIsExist) where = 'WHERE';
    const query = format(
      `SELECT 
              l.id,
              title,
              status,
              TO_CHAR(date_lesson::date,'yyyy-mm-dd') as date,
              SUM(sls.visit) as "visitCount",
              JSON_AGG(
                      DISTINCT JSONB_BUILD_OBJECT(
                        'id', sls.id,
                        'name', sls.name,
                        'visit', sls.visit
                    )
              ) as students,
              JSON_AGG(
                      DISTINCT JSONB_BUILD_OBJECT(
                        'id', tlt.id,
                        'name', tlt.name
                    )
              ) as teachers
            FROM public.lessons as l
            LEFT JOIN(SELECT id, name, ls.visit, ls.lesson_id
                    FROM public.students as s
                    JOIN public.lesson_students as ls
                    ON s.id = ls.student_id) as sls
            ON sls.lesson_id = l.id
            JOIN(
                SELECT id, name, lt.lesson_id
                FROM public.teachers as te
                JOIN public.lesson_teachers as lt
                ON te.id = lt.teacher_id %5$s
                ) as tlt
            ON tlt.lesson_id = l.id
            %1$s %2$s
            %3$s
            %4$s
            GROUP BY l.id
            %6$s  
            LIMIT %7$L OFFSET %8$L;`,
      where,
      conditionDate,
      and,
      conditionStatus,
      conditionTeacherIds,
      conditionStudentsCount,
      lessonsPerPage,
      (page - 1) * lessonsPerPage,
    );
    const result = (await client.query(query)).rows;
    return result.map((l) => {
      return {
        id: l.id,
        title: l.title,
        status: Number(l.status),
        date: l.date,
        visitCount: Number(l.visitCount),
        students: l.students.map((s) => {
          if (!s.id) return {};
          return {
            id: s.id,
            name: s.name,
            visit: s.visit,
          };
        }),
        teachers: l.teachers.map((t) => {
          return {
            id: t.id,
            name: t.name,
          };
        }),
      };
    });
  }
}
