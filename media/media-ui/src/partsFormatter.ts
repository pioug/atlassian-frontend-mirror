import type { PartsFormatterOptions } from './formatDate';

export const partsFormatter = ({
	day,
	month,
	year,
	hour,
	minute,
	dayPeriod = '',
}: PartsFormatterOptions): string => {
	const formattedDayPeriod = dayPeriod.replace(/\./g, '').replace(/\s/g, '');
	return `${day} ${month} ${year}, ${hour}:${minute} ${formattedDayPeriod}`;
};
