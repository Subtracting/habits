import { DayData } from "@/types/days.types";
import { MonthData } from "@/types/months.types";
import { WeekDaysData } from "@/types/weekdays.types";
import { HabitStats } from "@/types/stats.types";

export const allMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const allWeekDays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const toLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const computeMinMax = (data: DayData[]) => {
  if (!data || data.length === 0) {
    return { minValue: 0, maxValue: 0 };
  }
  const counts = data.map((item) => item.count);
  return {
    minValue: Math.min(...counts),
    maxValue: Math.max(...counts),
  };
};

export const calculateMonths = (habitDays: DayData[]): MonthData[] => {
  const monthData: MonthData[] = allMonths.map((month) => ({
    month,
    count: 0,
  }));

  if (!habitDays) return monthData;

  habitDays.forEach((dayData) => {
    const monthIndex = allMonths.indexOf(dayData.month);
    if (monthIndex >= 0) {
      monthData[monthIndex].count += dayData.count;
    }
  });

  return monthData;
};

export const calculateWeekDays = (habitDays: DayData[]): WeekDaysData[] => {
    const weekDaysData: WeekDaysData[] = allWeekDays.map((weekday) => ({
        weekday,
        count: 0,
    }));

    if (!habitDays) return weekDaysData;

    habitDays.forEach((dayData) => {
        const weekDayIndex = dayData.weekday;
        weekDaysData[weekDayIndex].count += dayData.count;
    });

    return weekDaysData;
};

export const calculateHabitStats = (habitDays: DayData[]): HabitStats => {
if (habitDays.length === 0) {
        return { total: 0, max: 0, min: 0, streak: 0, weekTotal: 0, monthTotal: 0 };
    }

    const sortedDays = [...habitDays].sort((a, b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return 0;
    });

    let total = 0;
    let max = sortedDays[0].count; 
    let min = sortedDays[0].count;
    let longestStreak = 0; 
    let currentStreak = 0;
    let weekTotal = 0;
    let monthTotal = 0;

    const lastDay = sortedDays[sortedDays.length - 1];

    for (let i = 0; i < sortedDays.length; i++) {
        const day = sortedDays[i];

        total += day.count;
        if (day.count > max) max = day.count;
        if (day.count < min) min = day.count;

        if (i >= sortedDays.length - 7) {
            weekTotal += day.count;
        }

        if (day.month === lastDay.month && day.year === lastDay.year) {
            monthTotal += day.count;
        }
        
        if (day.count === 0) {
            currentStreak = 0;
            continue; 
        }

        if (i === 0) {
            currentStreak = 1;
        } else {
            const prevDay = sortedDays[i - 1];
            
            const currentDate = new Date(day.date);
            const prevDate = new Date(prevDay.date);
            const timeDiff = currentDate.getTime() - prevDate.getTime();
            const dayDiff = Math.round(timeDiff / (1000 * 3600 * 24));

            if (dayDiff === 1) {
                currentStreak++;
            } else if (dayDiff > 1) {
                currentStreak = 1;
            } else if (dayDiff === 0) {
            }
        }
        
        if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
        }
    }
    
    if (total === 0) {
        min = 0;
    }

    const habitStats: HabitStats = {
        total: total,
        max: max,
        min: min,
        streak: currentStreak, 
        weekTotal: weekTotal,
        monthTotal: monthTotal
    };

    return habitStats;
};
