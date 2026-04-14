import type { DateObj } from './types';

export const toDateObj = (date: Date): DateObj => ({
	year: date.getFullYear(),
	month: date.getMonth() + 1,
	day: date.getDate(),
});
