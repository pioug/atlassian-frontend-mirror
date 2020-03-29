export type ArrowKeys = 'left' | 'up' | 'right' | 'down';

export type DateObj = {
  day: number;
  month: number;
  year: number;
};

export type ChangeEvent = {
  iso?: string;
  type: 'left' | 'up' | 'right' | 'down' | 'prev' | 'next';
} & DateObj;

export type SelectEvent = {
  iso: string;
} & DateObj;
