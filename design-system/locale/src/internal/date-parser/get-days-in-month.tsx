import { isLeapYear } from './is-leap-year';

export const getDaysInMonth = (year: number, month: number): number => {
	// February depends on leap year
	if (month === 2 && isLeapYear(year)) {
		return 29;
	}

	return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
};
