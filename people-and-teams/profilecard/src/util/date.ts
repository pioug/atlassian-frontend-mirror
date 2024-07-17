import { formatInTimeZone } from 'date-fns-tz';

export const localTime = (timezone: string, format: string) => {
	if (!timezone) {
		return null;
	}

	try {
		return formatInTimeZone(new Date(), timezone, format);
	} catch (error) {
		return null;
	}
};
