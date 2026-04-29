/**
 * Formats a date, time, and zone into a ISO string.
 */
export function formatDateTimeZoneIntoIso(date: string, time: string, zone: string): string {
	// 12:00 => 12:00, 1:00 => 01:00
	const needsLeadingZero: RegExp = /^\d:/;
	const sanitizedTime: string = needsLeadingZero.test(time) ? `0${time}` : time;

	return `${date}T${sanitizedTime}${zone}`;
}
