import { convertTo24hrTime } from './convert-to24hr-time';
import { isValid } from './is-valid';
import { removeSpacer } from './remove-spacer';

type TimeObject = {
	hour: number;
	minute: number;
	seconds: number;
};

function assignToDate(time: TimeObject): Date {
	const dateTime = new Date();
	dateTime.setHours(time.hour);
	dateTime.setMinutes(time.minute);
	// milliseconds is not supported
	dateTime.setSeconds(time.seconds || 0, 0);

	return dateTime;
}

export default function parseTime(time: string): string | Date {
	const trimmedTime = time.toString().trim();
	if (!isValid(trimmedTime)) {
		throw RangeError('invalid time format');
	}

	const time1 = removeSpacer(trimmedTime);
	const time2 = convertTo24hrTime(time1);

	if (!time2) {
		throw RangeError('invalid time format');
	}
	return assignToDate(time2);
}
