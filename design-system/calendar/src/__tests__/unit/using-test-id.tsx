import React from 'react';

import { render, screen } from '@testing-library/react';

import Calendar from '../../index';
import dateToString from '../../internal/utils/date-to-string';

const testId = 'testing';
const testIdNextYear = `${testId}--next-year`;
const testIdNextMonth = `${testId}--next-month`;
const testIdPrevMonth = `${testId}--previous-month`;
const testIdPrevYear = `${testId}--previous-year`;
const testIdMonth = `${testId}--month`;
const testIdWeek = `${testId}--week`;
const testIdCalendarDates = `${testId}--calendar-dates`;
const testIdDay = `${testId}--day`;
const testIdSelectedDay = `${testId}--selected-day`;
const testIdCurrentMonthYear = `${testId}--current-month-year`;
const testIdContainer = `${testId}--container`;
const testIdColumnHeader = `${testId}--column-header`;

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Calendar should be found by data-testid', () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth();

	const iso = dateToString({
		year,
		month,
		day: today.getDate(),
	});

	it('should be accessible via data-testid', () => {
		[
			{ name: 'Previous year button', selector: testIdPrevYear },
			{ name: 'Previous month button', selector: testIdPrevMonth },
			{ name: 'Next month button', selector: testIdNextMonth },
			{ name: 'Next year button', selector: testIdNextYear },
			{ name: 'Month', selector: testIdMonth },
			{ name: 'Weeks', selector: testIdWeek },
			{ name: 'Days', selector: testIdDay },
			{ name: 'Selected day', selector: testIdSelectedDay },
			{ name: 'Calendar dates', selector: testIdCalendarDates },
			{ name: 'Current month and year', selector: testIdCurrentMonthYear },
			{ name: 'Container', selector: testIdContainer },
			{ name: 'Column headers', selector: testIdColumnHeader },
		].forEach(({ selector }: { selector: string }) => {
			const { rerender, unmount } = render(
				<Calendar defaultSelected={[iso]} month={month} year={year} testId={testId} />,
			);
			expect(screen.queryAllByTestId(selector).length).toBeGreaterThan(0);

			rerender(<Calendar defaultSelected={[iso]} month={month} year={year} />);
			expect(screen.queryAllByTestId(selector).length).toBe(0);

			unmount();
		});
	});
});
