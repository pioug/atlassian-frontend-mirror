export type ArrowKeys = 'left' | 'up' | 'right' | 'down';

export type DateObj = {
  day: number;
  month: number;
  year: number;
};

export interface Week {
  id: string;
  values: Array<{
    id: string;
    isDisabled: boolean;
    isFocused: boolean;
    isToday: boolean;
    month: number;
    isPreviouslySelected: boolean;
    isSelected: boolean;
    isSiblingMonth: boolean;
    year: number;
    day: number;
  }>;
}

export interface Date {
  day: number;
  month: number;
  year: number;
  weekDay: number;
  selected: boolean;
  siblingMonth: boolean;
  weekNumber: number;
}

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
