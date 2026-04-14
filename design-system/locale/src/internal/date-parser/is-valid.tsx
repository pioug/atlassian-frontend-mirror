import { getDaysInMonth } from './get-days-in-month';
import type { DateObj } from './types';

export const isValid = (date: DateObj): boolean => {
	const { year, month, day } = date;
	const daysInMonth = getDaysInMonth(year, month);

	return 1 <= month && month <= 12 && 1 <= day && day <= daysInMonth;
};
