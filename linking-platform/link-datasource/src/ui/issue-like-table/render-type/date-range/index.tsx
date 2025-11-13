import React from 'react';

import addMonths from 'date-fns/addMonths';
import differenceInDays from 'date-fns/differenceInDays';
import endOfDay from 'date-fns/endOfDay';
import getDaysInMonth from 'date-fns/getDaysInMonth';
import isFirstDayOfMonth from 'date-fns/isFirstDayOfMonth';
import isLastDayOfMonth from 'date-fns/isLastDayOfMonth';
import isSameDay from 'date-fns/isSameDay';
import isSameMonth from 'date-fns/isSameMonth';
import isSameYear from 'date-fns/isSameYear';
import startOfDay from 'date-fns/startOfDay';
import { type FormatDateOptions, type IntlShape, useIntl } from 'react-intl-next';

import { type DateRangeType } from '@atlaskit/linking-types';
import { Text } from '@atlaskit/primitives/compiled';

import { messages } from './messages';

export interface DateRangeProps {
	testId?: string;
	value: DateRangeType['value'];
}

export const DATERANGE_TYPE_TEST_ID = 'link-datasource-render-type--daterange';

const dateOptions: FormatDateOptions = {
	month: 'short',
	day: 'numeric',
	year: 'numeric',
};

const timeOptions: FormatDateOptions = {
	hour12: false,
	hour: '2-digit',
	minute: '2-digit',
};

const isDayRange = (startDate: Date, endDate: Date): boolean => {
	// Naivly, we could just check
	// return startDate.getTime() === endDate.getTime();
	return (
		isSameYear(startDate, endDate) &&
		isSameMonth(startDate, endDate) &&
		isSameDay(startDate, endDate)
	);
};

const isMonthRange = (startDate: Date, endDate: Date): boolean => {
	return (
		isSameYear(startDate, endDate) &&
		isSameMonth(startDate, endDate) &&
		isFirstDayOfMonth(startDate) &&
		isLastDayOfMonth(endDate)
	);
};

/**
 * Checks if the date range is a quarter range.
 * A quarter range is a range of 3 months.
 * The start date must be the first day of the month.
 * The end date must be the last day of the month.
 * Quarters can span across multiple years.
 */
const isQuarterRange = (startDate: Date, endDate: Date): boolean => {
	// We need to add 1 to the difference in days
	// because the differenceInDays method returns the number of full days between the two dates
	// and we want to include the start and end dates
	const diffDays = Math.abs(differenceInDays(startDate, endDate)) + 1;
	const firstMonthDays = getDaysInMonth(startDate);
	const secondMonthDays = getDaysInMonth(addMonths(startDate, 1));
	const thirdMonthDays = getDaysInMonth(endDate);

	return (
		diffDays === firstMonthDays + secondMonthDays + thirdMonthDays &&
		isFirstDayOfMonth(startDate) &&
		isLastDayOfMonth(endDate)
	);
};

const getDateScale = (startDate: Date, endDate: Date): 'day' | 'month' | 'quarter' | 'full' => {
	if (isDayRange(startDate, endDate)) {
		// start: 2025-11-01
		// end: 2025-11-01
		return 'day';
	}

	if (isMonthRange(startDate, endDate)) {
		// start: 2025-11-01
		// end: 2025-11-30
		return 'month';
	}

	if (isQuarterRange(startDate, endDate)) {
		// start: 2025-11-01
		// end: 2026-01-31
		return 'quarter';
	}

	// start: 2025-11-02
	// end: 2026-05-19
	return 'full';
};

// I decided to reuse the same logic as we use currently in the date-time render type
// Alternatively, we could also use here `parseISO` from `date-fns`
const shiftUtcToLocal = (dateString: string): Date => {
	// In some cases we get a value of `2023-12-20` which when parsed by JS assumes meantime timezone, causing the date
	// to be one day off in some timezones. We want it to display the date without converting timezones and a solution
	// is to replace the hyphens with slashes. So it should be 20th Dec regardless of the timezone in this case.
	// See https://stackoverflow.com/a/31732581
	const dateValue = /^\d{4}-\d{2}-\d{2}$/.exec(dateString)
		? dateString.replace(/-/g, '/')
		: dateString;

	return new Date(dateValue);
};

const isDateTimeString = (dateString: string): boolean => {
	return dateString.match(/^\d{4}-\d{2}-\d{2}/) !== null && dateString.includes('T');
};

export function getFormattedDateRange(
	startValue: string,
	endValue: string,
	formatDate: IntlShape['formatDate'],
	formatMessage: IntlShape['formatMessage'],
): string {
	if (!startValue || !endValue) {
		return '';
	}

	const isDateTime = isDateTimeString(startValue) && isDateTimeString(endValue);

	const startDate = isDateTime ? new Date(startValue) : startOfDay(shiftUtcToLocal(startValue));
	const endDate = isDateTime ? new Date(endValue) : endOfDay(shiftUtcToLocal(endValue));

	if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
		return '';
	}

	// If startValue and endValue are valid ISO date strings, we consider it a full range
	const dateScale = isDateTime ? 'full' : getDateScale(startDate, endDate);

	switch (dateScale) {
		case 'day':
			// Nov 1, 2025
			return formatDate(startDate, {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			});
		case 'month':
			// Nov 2025
			return formatDate(startDate, {
				month: 'short',
				year: 'numeric',
			});
		case 'quarter': {
			// Jan-Mar, 2025
			if (isSameYear(startDate, endDate)) {
				return formatMessage(messages.quarterRange, {
					startMonth: formatDate(startDate, { month: 'short' }),
					endMonth: formatDate(endDate, { month: 'short' }),
					year: formatDate(startDate, { year: 'numeric' }),
				});
			}
			// Dec-Feb, 2025-2026
			return formatMessage(messages.quarterRangeOverYears, {
				startMonth: formatDate(startDate, { month: 'short' }),
				endMonth: formatDate(endDate, { month: 'short' }),
				startYear: formatDate(startDate, { year: 'numeric' }),
				endYear: formatDate(endDate, { year: 'numeric' }),
			});
		}
		case 'full':
			// Nov 1, 2025 - May 19, 2026
			// Jan 1, 2025, 00:00 - Mar 31, 2025, 23:59
			return formatMessage(messages.fullRange, {
				start: formatDate(startDate, { ...dateOptions, ...timeOptions }),
				end: formatDate(endDate, { ...dateOptions, ...timeOptions }),
			});
	}
}

const DateRangeRenderType = ({ value, testId = DATERANGE_TYPE_TEST_ID }: DateRangeProps) => {
	const { formatDate, formatMessage } = useIntl();
	const formattedString = getFormattedDateRange(value.start, value.end, formatDate, formatMessage);
	if (formattedString === '') {
		return <></>;
	}

	return <Text testId={testId}>{formattedString}</Text>;
};

export default DateRangeRenderType;
