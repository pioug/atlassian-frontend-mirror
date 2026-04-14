// oxlint-disable-next-line @atlassian/no-restricted-imports
import { getShortISOString } from './get-short-iso-string';

export function getSafeCalendarValue(calendarValue: string): string {
	// If `calendarValue` has a year that is greater than 9999, default to
	// today's date
	const yearIsOverLimit = calendarValue.match(/^\d{5,}/);
	if (yearIsOverLimit) {
		return getShortISOString(new Date());
	}
	return calendarValue;
}
