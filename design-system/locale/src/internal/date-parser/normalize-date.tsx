import { toDateObj } from './to-date-obj';
import type { DateObj } from './types';

export const normalizeDate = (date: DateObj, defaultFirstDay: boolean = false): DateObj => {
	const now = toDateObj(new Date());
	const { year, month, day } = date;

	// 19 should evaluate to 2019
	const fullYear = year < 100 ? 2000 + year : year;

	// Missing date pieces are filled in with their current date values
	const normalizedYear = !isNaN(fullYear) ? fullYear : now.year;
	const normalizedMonth = !isNaN(month) && month !== 0 ? month : now.month;
	const normalizedDay =
		!isNaN(day) && day !== 0 ? day : month !== 0 && defaultFirstDay ? 1 : now.day;

	return {
		year: normalizedYear,
		month: normalizedMonth,
		day: normalizedDay,
	};
};
