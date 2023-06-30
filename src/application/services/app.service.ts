import { inject, injectable } from 'inversify';
import { AppCommandRepo } from '../../infrastructure/repositories/app-command.repo';
import { LessonCreateDto } from '../../types';
import { add, intervalToDuration, isWithinInterval } from 'date-fns';

@injectable()
export class AppService {
  constructor(@inject(AppCommandRepo) private appCommandRepo: AppCommandRepo) {}
  async createLessons(lessonsDto: LessonCreateDto) {
    const { teacherIds, title, days, firstDate, lastDate, lessonsCount } =
      lessonsDto;
    let teacher = null;
    let i = 0;
    do {
      teacher = await this.appCommandRepo.findTeacherById(teacherIds[i]);
      i++;
    } while (teacher && i < teacherIds.length);
    if (!teacher) return null;
    if (lessonsDto.lastDate) {
    }
    const a = intervalToDuration({
      start: new Date(),
      end: add(new Date(), { days: 1 }),
    });
    if (lastDate) {
      if (lastDate < firstDate) return null;
      const daysTemp = [...days];
      for (let i = 0; i < daysTemp.length; i++) {
        if (daysTemp[i] < firstDate.getDay())
          daysTemp[i] = daysTemp[i] + 7 - firstDate.getDay();
        else if (daysTemp[i] >= firstDate.getDay())
          daysTemp[i] = daysTemp[i] - firstDate.getDay();
      }
      daysTemp.sort();
      const interval = daysTemp[daysTemp.length - 1];
      if (
        !isWithinInterval(add(firstDate, { days: interval }), {
          start: firstDate,
          end: lastDate,
        })
      )
        return null;
      let date = firstDate;
      while (date <= lastDate) {
        if (days.includes(date.getDay())) console.log(date);
        date = add(date, { days: 1 });
      }
    }
  }
}
