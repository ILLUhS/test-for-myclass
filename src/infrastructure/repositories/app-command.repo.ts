import { injectable } from 'inversify';
import { client } from '../database';
import format = require('pg-format');

@injectable()
export class AppCommandRepo {
  async createStudent(name: string) {
    const query = format(
      `INSERT INTO public.students(name)
    VALUES (%s1) RETURNING "id";`,
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
    return client.query(query);
  }
  async addStudentToLesson(lessonId: number, studentId: number, visit: 0 | 1) {
    const query = format(
      `INSERT INTO public.lesson_sudents(lesson_id,student_id)
            VALUES (%1$L, %2$L, %3$L));`,
      lessonId,
      studentId,
      visit,
    );
    await client.query(query);
  }
  async addTeacherToLesson(lessonId: number, teacherId: number) {
    const query = format(
      `INSERT INTO public.lesson_teachers(lesson_id,student_id, visit)
            VALUES (%1$L, %2$L;`,
      lessonId,
      teacherId,
    );
    await client.query(query);
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
    console.log(result);
    return result;
  }
}
