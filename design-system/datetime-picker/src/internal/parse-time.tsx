import type { TimeFormat } from '@atlaskit/locale/get-time-format';

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

function parseLegacyTime(time: string, allowCompactTime = false): Date {
	const trimmedTime = time.toString().trim();
	const compactTime = allowCompactTime ? trimmedTime.match(/^\d{5}$/) : null;
	if (compactTime) {
		const normalizedTime = `0${compactTime[0]}`;
		const hour = Number(normalizedTime.slice(0, 2));
		const minute = Number(normalizedTime.slice(2, 4));
		const seconds = Number(normalizedTime.slice(4, 6));
		if (minute <= 59 && seconds <= 59) {
			return assignToDate({ hour, minute, seconds });
		}
	}
	if (/^\d{5}$/.test(trimmedTime)) {
		throw RangeError('invalid time format');
	}

	if (!isValid(trimmedTime)) {
		throw RangeError('invalid time format');
	}

	const time1 = removeSpacer(trimmedTime);
	const time2 = convertTo24hrTime(time1);

	if (!time2) {
		throw RangeError('invalid time format');
	}
	return assignToDate({ ...time2, hour: time2.hour === 24 ? 0 : time2.hour });
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeDigits = (time: string, timeFormat: TimeFormat) =>
	Array.from(time, (character) => timeFormat.digits[character] || character).join('');

const isValidHourForCycle = (hour: number, hourCycle: TimeFormat['hourCycle']) =>
	hourCycle === 'h11' ? hour <= 11 : hourCycle === 'h12' ? hour >= 1 && hour <= 12 : hour <= 24;

function parseExactLocalizedTime(time: string, timeFormat: TimeFormat): Date | null | undefined {
	if (!timeFormat.timeParts) {
		return undefined;
	}

	const dayPeriods = Object.entries(timeFormat.dayPeriods).filter(([, value]) => value);
	const groupTypes: Array<'hour' | 'minute' | 'second' | 'dayPeriod'> = [];
	const patternParts = timeFormat.timeParts.map((part) => {
		if (part.type === 'hour' || part.type === 'minute' || part.type === 'second') {
			groupTypes.push(part.type);
			return part.type === 'hour' ? '(\\d{1,2})' : '(\\d{2})';
		}
		if (part.type === 'dayPeriod') {
			if (dayPeriods.length === 0) {
				return null;
			}
			groupTypes.push('dayPeriod');
			return `(${dayPeriods.map(([, value]) => escapeRegExp(value)).join('|')})`;
		}
		if (part.type === 'literal') {
			return escapeRegExp(part.value);
		}
		return null;
	});

	if (patternParts.some((part) => part === null)) {
		return undefined;
	}

	const match = time.match(new RegExp(`^${patternParts.join('')}$`, 'u'));
	if (!match) {
		return undefined;
	}

	const values = Object.fromEntries(groupTypes.map((type, index) => [type, match[index + 1]]));
	if (!values.hour || !values.minute) {
		return undefined;
	}

	const hour = Number(values.hour);
	const minute = Number(values.minute);
	const seconds = Number(values.second || '0');
	if (minute > 59 || seconds > 59) {
		return null;
	}

	if (values.dayPeriod) {
		const period = dayPeriods.find(([, value]) => value === values.dayPeriod)?.[0];
		if (!period || !isValidHourForCycle(hour, timeFormat.hourCycle)) {
			return null;
		}
		return assignToDate({
			hour: period === 'pm' ? (hour % 12) + 12 : hour % 12,
			minute,
			seconds,
		});
	}

	if (hour > 24) {
		return null;
	}

	return assignToDate({ hour: hour === 24 ? 0 : hour, minute, seconds });
}

function parseLocalizedTime(
	normalizedTime: string,
	timeFormat: TimeFormat,
): Date | null | undefined {
	const dayPeriods = Object.entries(timeFormat.dayPeriods).filter(([, value]) => value);
	const markers = dayPeriods.filter(([, value]) =>
		new RegExp(escapeRegExp(value), 'u').test(normalizedTime),
	);

	if (markers.length === 0) {
		return undefined;
	}
	if (markers.length !== 1) {
		return null;
	}

	const [[period, marker]] = markers;
	const numericTime = normalizedTime.replace(new RegExp(escapeRegExp(marker), 'u'), '').trim();
	const match = numericTime.match(/^(\d{1,2})(?:[:.](\d{2}))?(?:[:.](\d{2}))?$/);
	if (!match) {
		return null;
	}

	const [, hourValue, minuteValue = '0', secondValue = '0'] = match;
	const hour = Number(hourValue);
	const minute = Number(minuteValue);
	const seconds = Number(secondValue);
	if (!isValidHourForCycle(hour, timeFormat.hourCycle) || minute > 59 || seconds > 59) {
		return null;
	}

	return assignToDate({
		hour: period === 'pm' ? (hour % 12) + 12 : hour % 12,
		minute,
		seconds,
	});
}

export default function parseTime(time: string, timeFormat?: TimeFormat): string | Date {
	if (timeFormat) {
		const normalizedTime = normalizeDigits(time, timeFormat);
		const exactLocalizedTime = parseExactLocalizedTime(normalizedTime, timeFormat);
		if (exactLocalizedTime instanceof Date) {
			return exactLocalizedTime;
		}
		if (exactLocalizedTime === null) {
			throw RangeError('invalid time format');
		}

		const localizedTime = parseLocalizedTime(normalizedTime, timeFormat);
		if (localizedTime instanceof Date) {
			return localizedTime;
		}
		if (localizedTime === null) {
			throw RangeError('invalid time format');
		}

		return parseLegacyTime(normalizedTime, true);
	}

	return parseLegacyTime(time);
}
