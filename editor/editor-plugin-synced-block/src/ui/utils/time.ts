import isYesterday from 'date-fns/isYesterday';
import { type IntlShape } from 'react-intl-next';

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24;
const SECONDS_IN_WEEK = SECONDS_IN_DAY * 7;
const SECONDS_IN_MONTH = SECONDS_IN_DAY * 30;
const SECONDS_IN_YEAR = SECONDS_IN_DAY * 365;

export const formatElapsedTime = (isoDate: string, intl: IntlShape): string => {
	const now = Date.now();
	const date = new Date(isoDate).getTime();
	const diffInSeconds = Math.floor((now - date) / 1000);
	const dateObj = new Date(isoDate);

	// Show "yesterday" when timestamp is from the previous calendar day
	if (isYesterday(dateObj) && diffInSeconds >= SECONDS_IN_DAY) {
		return intl.formatRelativeTime(-1, 'day', { numeric: 'auto', style: 'long' });
	}

	if (diffInSeconds < SECONDS_IN_MINUTE) {
		return intl.formatRelativeTime(-Math.max(diffInSeconds, 1), 'second', { style: 'long' });
	} else if (diffInSeconds < SECONDS_IN_HOUR) {
		const minutes = Math.floor(diffInSeconds / SECONDS_IN_MINUTE);
		return intl.formatRelativeTime(-minutes, 'minute', { style: 'long' });
	} else if (diffInSeconds < SECONDS_IN_DAY) {
		const hours = Math.floor(diffInSeconds / SECONDS_IN_HOUR);
		return intl.formatRelativeTime(-hours, 'hour', { style: 'long' });
	} else if (diffInSeconds < SECONDS_IN_WEEK) {
		const days = Math.floor(diffInSeconds / SECONDS_IN_DAY);
		return intl.formatRelativeTime(-days, 'day', { style: 'long' });
	} else if (diffInSeconds < SECONDS_IN_MONTH) {
		const weeks = Math.floor(diffInSeconds / SECONDS_IN_WEEK);
		return intl.formatRelativeTime(-weeks, 'week', { style: 'long' });
	} else if (diffInSeconds < SECONDS_IN_YEAR) {
		const months = Math.floor(diffInSeconds / SECONDS_IN_MONTH);
		return intl.formatRelativeTime(-months, 'month', { style: 'long' });
	} else {
		const years = Math.floor(diffInSeconds / SECONDS_IN_YEAR);
		return intl.formatRelativeTime(-years, 'year', { style: 'long' });
	}
};