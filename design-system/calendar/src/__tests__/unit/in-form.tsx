import React from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Calendar from '../../index';

const testId = 'testing';
const testIdMonth = `${testId}--month`;
const testIdWeek = `${testId}--week`;
const testIdSelectedDay = `${testId}--selected-day`;

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Calendar should not submit form', () => {
	const onSubmit = jest.fn();

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('Day selection does not trigger form (click)', async () => {
		const user = userEvent.setup();
		render(
			<form onSubmit={onSubmit}>
				<Calendar testId={testId} />
			</form>,
		);

		const weekContainers = screen.getAllByTestId(testIdWeek);

		expect(() => screen.getByTestId(testIdSelectedDay)).toThrow();

		// WeekDayGrid > role="gridcell" > button
		const weekContainer = weekContainers[0];
		const gridcell = within(weekContainer).getAllByRole('gridcell')[0];
		const dayButton = within(gridcell).getAllByRole('button')[0];
		await user.click(dayButton);

		expect(onSubmit).toHaveBeenCalledTimes(0);

		// but the day _is_ now selected
		expect(screen.getByTestId(testIdSelectedDay)).toBeInTheDocument();
	});

	it('Day selection does not trigger form (enter)', () => {
		render(
			<form onSubmit={onSubmit}>
				<Calendar testId={testId} />
			</form>,
		);

		const monthContainer = screen.getByTestId(testIdMonth);

		expect(() => screen.getByTestId(testIdSelectedDay)).toThrow();

		// this is 'a day'
		fireEvent.keyDown(within(monthContainer).getAllByRole('button')[0], {
			key: 'Enter',
			code: 13,
		});

		expect(onSubmit).toHaveBeenCalledTimes(0);

		// but the day _is_ now selected
		expect(screen.getByTestId(testIdSelectedDay)).toBeInTheDocument();
	});
});
