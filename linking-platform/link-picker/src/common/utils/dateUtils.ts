//copied from packages/activity-platform/recent-work-ui/src/common/ui/activity-event-type-message/utils.ts
export type Unit = 'second' | 'minute' | 'hour' | 'day' | 'week';

const MS_PER_SECOND = 1e3;
const SECS_PER_MIN = 60;
const SECS_PER_HOUR = SECS_PER_MIN * 60;
const SECS_PER_DAY = SECS_PER_HOUR * 24;
const SECS_PER_WEEK = SECS_PER_DAY * 7;

// This function is a direct copy from https://github.com/formatjs/formatjs-old/blob/master/packages/intl-utils/src/diff.ts
// If the year between 'from' and 'to' is different and there is more than a week between them, the function returns
// 'year' as the unit. This means some activities display a '1 year ago' even though its 10 days old.
//
// In the below, we have removed the check for 'year' and 'month' as we display absolute dates for those periods.
export function selectUnit(
	from: Date | number,
	to: Date | number = Date.now(),
	thresholds: Partial<Thresholds> = {},
): { value: number; unit: Unit } {
	const resolvedThresholds: Thresholds = {
		...DEFAULT_THRESHOLDS,
		...(thresholds || {}),
	};
	const secs = (+from - +to) / MS_PER_SECOND;
	if (Math.abs(secs) < resolvedThresholds.second) {
		return {
			value: Math.round(secs),
			unit: 'second',
		};
	}
	const mins = secs / SECS_PER_MIN;
	if (Math.abs(mins) < resolvedThresholds.minute) {
		return {
			value: Math.round(mins),
			unit: 'minute',
		};
	}
	const hours = secs / SECS_PER_HOUR;
	if (Math.abs(hours) < resolvedThresholds.hour) {
		return {
			value: Math.round(hours),
			unit: 'hour',
		};
	}

	const days = secs / SECS_PER_DAY;
	if (Math.abs(days) < resolvedThresholds.day) {
		return {
			value: Math.round(days),
			unit: 'day',
		};
	}

	const weeks = secs / SECS_PER_WEEK;

	return {
		value: Math.round(weeks),
		unit: 'week',
	};
}

type Thresholds = Record<'second' | 'minute' | 'hour' | 'day', number>;

export const DEFAULT_THRESHOLDS: Thresholds = {
	second: 45, // seconds to minute
	minute: 45, // minutes to hour
	hour: 22, // hour to day
	day: 5, // day to week
};
