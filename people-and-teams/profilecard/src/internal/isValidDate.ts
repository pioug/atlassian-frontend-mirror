import isValid from 'date-fns/isValid';

export function isValidDate(date: Date, today: Date = new Date()): boolean {
	return !!date.getTime && isValid(date) && date.getTime() <= today.getTime();
}
