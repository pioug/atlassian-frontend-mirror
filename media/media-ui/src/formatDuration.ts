import { isInvalidInput } from './isInvalidInput';
import { pad } from './pad';
import { secondsToTime } from './secondsToTime';

export const formatDuration = (seconds: number): string => {
	if (isInvalidInput(seconds)) {
		return '0:00';
	}

	const { hours, minutes, seconds: remainingSeconds } = secondsToTime(seconds);

	const prettyHoursWithSeparator = hours > 0 ? hours + ':' : '';
	const prettyMinutes = prettyHoursWithSeparator ? pad(minutes) : minutes;

	return `${prettyHoursWithSeparator}${prettyMinutes}:${pad(remainingSeconds)}`;
};
