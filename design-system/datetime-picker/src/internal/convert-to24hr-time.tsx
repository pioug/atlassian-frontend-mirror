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

type TimeObject = {
	hour: number;
	minute: number;
	seconds: number;
};

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
