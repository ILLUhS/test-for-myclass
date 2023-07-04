import { inject, injectable } from 'inversify';
import { AppCommandRepo } from '../../infrastructure/repositories/app-command.repo';
import { LessonCreateDtoType } from '../../types';
import { add, isWithinInterval } from 'date-fns';

@injectable()
export class AppService {
  constructor(@inject(AppCommandRepo) private appCommandRepo: AppCommandRepo) {}
  async createLessons(lessonsDto: LessonCreateDtoType) {
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
    if (lastDate) {
      //проверка, что все указанные дни недели укладываются в интервал
      if (
        !this.checkIntervalBetweenFirstAndLastDate(firstDate, lastDate, [
          ...days,
        ])
      )
        return null;
      if (lastDate > add(firstDate, { years: 1 }))
        lastDate = add(firstDate, { years: 1 });
    }
    let date = firstDate;
    let count = 0;
    const dateLimit = add(firstDate, { years: 1 });
    const lessonsIds: number[] = [];
    while (
      this.checkDateLessLastDateAndCountLessLimitAndDateLimit(
        date,
        dateLimit,
        lastDate,
        lessonsCount,
        count,
      )
    ) {
      if (days.includes(date.getDay())) {
        const lessonId = (
          await this.appCommandRepo.createLesson(title, 0, date)
        ).id;
        lessonsIds.push(lessonId);
        for (let i = 0; i < teacherIds.length; i++)
          await this.appCommandRepo.addTeacherToLesson(lessonId, teacherIds[i]);
      }
      date = add(date, { days: 1 });
      count++;
    }
    return lessonsIds;
  }
  checkDateLessLastDateAndCountLessLimitAndDateLimit(
    date: Date,
    dateLimit: Date,
    lastDate: Date,
    lessonsCount: number,
    currentCount: number,
  ) {
    if (lastDate)
      return date <= lastDate && currentCount < 300 && date <= dateLimit;
    else if (lessonsCount)
      return (
        currentCount < lessonsCount && currentCount < 300 && date <= dateLimit
      );
  }
  checkIntervalBetweenFirstAndLastDate(
    firstDate: Date,
    lastDate: Date,
    days: number[],
  ) {
    if (lastDate < firstDate) return false;
    for (let i = 0; i < days.length; i++) {
      if (days[i] < firstDate.getDay())
        days[i] = days[i] + 7 - firstDate.getDay();
      else if (days[i] >= firstDate.getDay())
        days[i] = days[i] - firstDate.getDay();
    }
    days.sort();
    const interval = days[days.length - 1];
    return isWithinInterval(add(firstDate, { days: interval }), {
      start: firstDate,
      end: lastDate,
    });
  }
}
