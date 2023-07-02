import { inject, injectable } from 'inversify';
import { AppCommandRepo } from '../../infrastructure/repositories/app-command.repo';
import { LessonCreateDto } from '../../types';
import { add, isWithinInterval } from 'date-fns';

@injectable()
export class AppService {
  constructor(@inject(AppCommandRepo) private appCommandRepo: AppCommandRepo) {}
  async createLessons(lessonsDto: LessonCreateDto) {
    const { teacherIds, title, days, firstDate, lessonsCount } = lessonsDto;
    let { lastDate } = lessonsDto;
    //check teachers with current ids is exists
    let teacher = null;
    let i = 0;
    do {
      teacher = await this.appCommandRepo.findTeacherById(teacherIds[i]);
      i++;
    } while (teacher && i < teacherIds.length);
    if (!teacher) return null;
    //проверка, что все указанные дни недели укладываются в интервал
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
      if (lastDate > add(firstDate, { years: 1 }))
        lastDate = add(firstDate, { years: 1 });
    }
    let date = firstDate;
    let count = 0;
    const dateLimit = add(firstDate, { years: 1 });
    while (
      this.checkDateLessLastDateAndCountLessLimitAndDateLimit(
        date,
        dateLimit,
        lastDate,
        lessonsCount,
        count,
      )
    ) {
      if (days.includes(date.getDay())) console.log(date);
      date = add(date, { days: 1 });
      count++;
    }
  }
  checkDateLessLastDateAndCountLessLimitAndDateLimit(
    date: Date,
    dateLimit: Date,
    lastDate: Date,
    lessonsCount: number,
    currentCount: number,
  ) {
    if (lastDate)
      return date <= lastDate && currentCount <= 300 && date <= dateLimit;
    else if (lessonsCount) return currentCount <= 300 && date <= dateLimit;
  }
}
