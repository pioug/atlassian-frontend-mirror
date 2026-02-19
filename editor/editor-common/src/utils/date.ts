import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import isBefore from 'date-fns/isBefore';
import type { IntlShape } from 'react-intl-next';

import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

enum FORMATS {
	ISO_FORMAT = 'YYYY-MM-DD',
	LOCALIZED_FORMAT = 'LOCALIZED_FORMAT',
}

export interface Date {
	day: number;
	month: number;
	year: number;
}

export const timestampToUTCDate = (timestamp: string | number): Date => {
	const date = new Date(Number(timestamp));
	const day = date.getUTCDate();
	const month = date.getUTCMonth() + 1;
	const year = date.getUTCFullYear();
	return { day, month, year };
};

export const todayTimestampInUTC = (timeZone?: string): string => {
	const today = new Date(Date.now());
	if (timeZone && expValEquals('confluence_frontend_fix_date_hydration_error', 'isEnabled', true)) {
		const parts = new Intl.DateTimeFormat('en-US', {
			timeZone,
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
		}).formatToParts(today);
		const year = Number(parts.find((p) => p.type === 'year')?.value);
		const month = Number(parts.find((p) => p.type === 'month')?.value) - 1;
		const day = Number(parts.find((p) => p.type === 'day')?.value);
		return Date.UTC(year, month, day).toString();
	}
	const todayInUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
	return todayInUTC.toString();
};

const addLeadingZero = (val: number) => {
	if (val < 10) {
		return `0${val}`;
	}
	return val;
};

const capitalizeFirstLetter = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

// example: "23 Jan 2018"
export const timestampToString = (
	timestamp: string | number,
	intl: IntlShape | null,
	pattern?: FORMATS,
): string => {
	if (!intl || pattern === FORMATS.ISO_FORMAT) {
		return timestampToIsoFormat(timestamp);
	}

	const date = new Date(Number(timestamp));

	return intl.formatDate(date, {
		timeZone: 'UTC',
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		formatMatcher: 'best fit',
	});
};

// example: "2018-01-23"
export const timestampToIsoFormat = (timestamp: string | number): string => {
	const date = new Date(Number(timestamp));
	return `${date.getUTCFullYear()}-${addLeadingZero(
		date.getUTCMonth() + 1,
	)}-${addLeadingZero(date.getUTCDate())}`;
};

export const isPastDate = (timestamp: string | number, timeZone?: string): boolean => {
	return isBefore(new Date(Number(timestamp)), new Date(Number(todayTimestampInUTC(timeZone))));
};

export const timestampToTaskContext = (
	timestamp: string | number,
	intl: IntlShape,
	timeZone?: string,
): string => {
	const curDate = new Date(Number(todayTimestampInUTC(timeZone)));
	const givenDate = new Date(Number(timestamp));
	const distance = differenceInCalendarDays(givenDate, curDate);
	if (intl && [-1, 0, 1].indexOf(distance) > -1) {
		return capitalizeFirstLetter(intl.formatRelativeTime(distance, 'day', { numeric: 'auto' }));
	}

	return timestampToString(timestamp, intl, FORMATS.LOCALIZED_FORMAT);
};
