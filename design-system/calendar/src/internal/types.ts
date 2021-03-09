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

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type ISODate = string;
