import type { WeekDay } from '../types';

export type ArrowKeys = 'left' | 'up' | 'right' | 'down';

export type DateObj = {
  day: number;
  month: number;
  year: number;
};

export interface WeekDayState {
  isDisabled: boolean;
  isFocused: boolean;
  isToday: boolean;
  isPreviouslySelected: boolean;
  isSelected: boolean;
  isSiblingMonth: boolean;
}

export interface Week {
  id: string;
  values: Array<
    {
      id: string;
    } & DateObj &
      WeekDayState
  >;
}

export interface CalendarDate extends DateObj {
  weekDay?: WeekDay;
  siblingMonth?: boolean;
}

export type ISODate = string;
