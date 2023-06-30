import { inject, injectable } from 'inversify';
import { AppCommandRepo } from '../../infrastructure/repositories/app-command.repo';
import { LessonCreateDto } from '../../types';

@injectable()
export class AppService {
  constructor(@inject(AppCommandRepo) private appCommandRepo: AppCommandRepo) {}
  async createLessons(lessonsDto: LessonCreateDto) {
    let teacher = null;
    let i = 0;
    do {
      teacher = await this.appCommandRepo.findTeacherById(
        lessonsDto.teacherIds[i],
      );
      i++;
    } while (teacher && i < lessonsDto.teacherIds.length);
    if (!teacher) return null;
    if (lessonsDto.lastDate) {
    }
  }
}
