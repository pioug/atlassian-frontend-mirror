import type { DateObj } from './types';

export const toDate = (date: DateObj): Date =>
	// The 'proper' month is stored in a DateObj but Date expects month index
	new Date(date.year, date.month - 1, date.day);
