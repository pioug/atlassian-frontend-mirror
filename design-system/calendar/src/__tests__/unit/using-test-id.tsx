import React from 'react';

import { render, screen } from '@testing-library/react';
import cases from 'jest-in-case';

import Calendar from '../../index';
import dateToString from '../../internal/utils/date-to-string';

const testId = 'testing';
const testIdNextMonth = `${testId}--next-month`;
const testIdPrevMonth = `${testId}--previous-month`;
const testIdMonth = `${testId}--month`;
const testIdWeek = `${testId}--week`;
const testIdCalendarDates = `${testId}--calendar-dates`;
const testIdDay = `${testId}--day`;
const testIdSelectedDay = `${testId}--selected-day`;
const testIdCurrentMonthYear = `${testId}--current-month-year`;
const testIdContainer = `${testId}--container`;
const testIdColumnHeader = `${testId}--column-header`;

describe('Calendar should be found by data-testid', () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth();

	const iso = dateToString({
		year,
		month,
		day: today.getDate(),
	});

	cases(
		'should be accessible via data-testid',
		({ selector }: { selector: string }) => {
			const { rerender, unmount } = render(
				<Calendar defaultSelected={[iso]} month={month} year={year} testId={testId} />,
			);
			expect(screen.queryAllByTestId(selector).length).toBeGreaterThan(0);

			rerender(<Calendar defaultSelected={[iso]} month={month} year={year} />);
			expect(screen.queryAllByTestId(selector).length).toBe(0);

			unmount();
		},
		[
			{ name: 'Previous month button', selector: testIdPrevMonth },
			{ name: 'Next month button', selector: testIdNextMonth },
			{ name: 'Month', selector: testIdMonth },
			{ name: 'Weeks', selector: testIdWeek },
			{ name: 'Days', selector: testIdDay },
			{ name: 'Selected day', selector: testIdSelectedDay },
			{ name: 'Calendar dates', selector: testIdCalendarDates },
			{ name: 'Current month and year', selector: testIdCurrentMonthYear },
			{ name: 'Container', selector: testIdContainer },
			{ name: 'Column headers', selector: testIdColumnHeader },
		],
	);
});
