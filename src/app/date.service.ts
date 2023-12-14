import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  getWeekDates() {
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
    const weekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDayOfWeek));
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      let weekDate = new Date(weekStart);
      weekDate.setDate(weekStart.getDate() + i);
      weekDates.push(weekDate);
    }
  
    return weekDates
  }
  
  findCurrentDay(weekDates) {
    const today = new Date();
    return weekDates.findIndex(date => 
      date.getDate() === today.getDate() && 
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }
}
