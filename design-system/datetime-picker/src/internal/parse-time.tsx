type TimeObject = {
	hour: number;
	minute: number;
	seconds: number;
};

const map24: Record<string, string> = {
	'12': '12',
	'01': '13',
	'02': '14',
	'03': '15',
	'04': '16',
	'05': '17',
	'06': '18',
	'07': '19',
	'08': '20',
	'09': '21',
	'10': '22',
	'11': '23',
};

export function isValid(timeString: string): boolean {
	/**
	 * Regex match for `12:34`, `12:34:56`, `1:23:56 p`, `1:23:56PM`, and a bit more…
	 */
	const time = timeString
		.trim()
		.match(/([012]?[\d])(?::([0-5][\d]))?(?::([0-5][\d]))?\s*([ap]m?)?/i);

	/**
	 * Regex match for `1234`, `12:34`, `12.34`, `123456`, `12:34:56`, `12.34.56`
	 */
	const time24hr = timeString.trim().match(/([012][\d])[:.]?([0-5][\d])([:.]?([0-5][\d]))?/);

	/**
	 * Convert `2:34:56 pm` down to `23456`
	 */
	const num = timeString.replace(/[^0-9]/g, '');

	const includesSeconds =
		(time && time[1] !== undefined && time[2] !== undefined && time[3] !== undefined) ||
		(time24hr &&
			time24hr[1] !== undefined &&
			time24hr[2] !== undefined &&
			time24hr[4] !== undefined);

	if (!time && !time24hr) {
		return false;
	}
	if (time && !time[1]) {
		return false;
	}
	if (num.length > 6) {
		return false;
	}
	if (num.length > 4 && !includesSeconds) {
		return false;
	}
	if (num.length === 2 && parseInt(num, 10) > 12) {
		return false;
	}
	return true;
}

export function removeSpacer(time: string): string {
	return time.replace(/[:.]/g, '');
}

function formatSemi24(time: string): string {
	if (time.length === 1) {
		return `0${time}00`;
	}
	if (time.length === 2) {
		return `${time}00`;
	}
	if (time.length === 3 || time.length === 5) {
		return `0${time}`;
	}
	return time;
}

function checkHour(hour: string, meridiem: string): string | null {
	if (hour > '24') {
		return null;
	}
	if (hour === '12' && meridiem === 'a') {
		return '00';
	}
	if (hour < '12' && meridiem === 'p') {
		return map24[hour];
	}
	return hour;
}

function checkMinuteSecond(value: string): string | null {
	if (value > '59') {
		return null;
	}
	return value;
}

export function convertTo24hrTime(time: string): TimeObject | null {
	const timeArray = time.toLowerCase().split(/(p|a)/i);
	const meridiem = timeArray[1];
	const semi24 = formatSemi24(timeArray[0].trim());

	const hour = checkHour(semi24.substring(0, 2), meridiem);
	const minute = checkMinuteSecond(semi24.substring(2, 4));
	const seconds = semi24.length === 6 && checkMinuteSecond(semi24.substring(4, 6));

	if (!hour || !minute) {
		return null;
	}

	return {
		hour: parseInt(hour, 10),
		minute: parseInt(minute, 10),
		seconds: parseInt(seconds || '0', 10) || 0,
	};
}

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
