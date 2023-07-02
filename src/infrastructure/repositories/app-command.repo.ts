import { injectable } from 'inversify';
import { client } from '../database';
import format = require('pg-format');

@injectable()
export class AppCommandRepo {
  async createStudent(name: string) {
    const query = format(
      `INSERT INTO public.students(name)
    VALUES (%L)) RETURNING "id";`,
      name,
    );
    return client.query(query);
  }
  async createTeacher(name: string) {
    const query = format(
      `INSERT INTO public.teachers(name)
            VALUES (%L) RETURNING "id";`,
      name,
    );
    return (await client.query(query)).rows[0];
  }
  async createLesson(title: string, status: 0 | 1, date_lesson: Date) {
    const query = format(
      `INSERT INTO public.lessons(title, status, date_lesson)
            VALUES (%1$L, %2$L, %3$L) RETURNING "id";`,
      title,
      status,
      date_lesson,
    );
    return (await client.query(query)).rows[0];
  }
  async addStudentToLesson(lessonId: number, studentId: number, visit: 0 | 1) {
    const query = format(
      `INSERT INTO public.lesson_sudents(lesson_id,student_id)
            VALUES (%1$L, %2$L, %3$L) RETURNING "id";`,
      lessonId,
      studentId,
      visit,
    );
    return (await client.query(query)).rows[0];
  }
  async addTeacherToLesson(lessonId: number, teacherId: number) {
    const query = format(
      `INSERT INTO public.lesson_teachers(lesson_id, teacher_id)
            VALUES (%1$L, %2$L) RETURNING lesson_id, teacher_id;`,
      lessonId,
      teacherId,
    );
    return (await client.query(query)).rows[0];
  }
  async updateStudentVisitToLesson(
    lessonId: number,
    studentId: number,
    visit: 0 | 1,
  ) {
    const query = format(
      `UPDATE public.lesson_students
            SET visit=%3$L
            WHERE lesson_id=%1$L AND student_id=%2$L;`,
      lessonId,
      studentId,
      visit,
    );
    await client.query(query);
  }
  async findTeacherById(id: number) {
    const query = format(
      `SELECT id, name
            FROM public.teachers
            WHERE id=%L;`,
      id,
    );
    const result = await client.query(query);
    if (result.rowCount < 1) return null;
    console.log(result.rows);
    return result.rows[0];
  }
}
