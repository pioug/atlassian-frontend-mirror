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

/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import { isInvalidInput } from '@atlaskit/media-ui/isInvalidInput'` instead.
 */
export { isInvalidInput } from './isInvalidInput';
/**
 * @deprecated Use `import { secondsToTime } from '@atlaskit/media-ui/secondsToTime'` instead.
 */
export { secondsToTime } from './secondsToTime';
