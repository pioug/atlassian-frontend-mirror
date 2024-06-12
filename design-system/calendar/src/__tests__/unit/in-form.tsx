import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import Calendar from '../../index';

const testId = 'testing';
const testIdMonth = `${testId}--month`;
const testIdWeek = `${testId}--week`;
const testIdSelectedDay = `${testId}--selected-day`;

describe('Calendar should not submit form', () => {
	const onSubmit = jest.fn();

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('Day selection does not trigger form (click)', () => {
		render(
			<form onSubmit={onSubmit}>
				<Calendar testId={testId} />
			</form>,
		);

		const weekContainer = screen.getAllByTestId(testIdWeek);

		expect(() => screen.getByTestId(testIdSelectedDay)).toThrow();

		// WeekDayGrid > role="gridcell" > button
		fireEvent.click(weekContainer[0].children[0].children[0]);

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
		fireEvent.keyDown(monthContainer.children[0], {
			key: 'Enter',
			code: 13,
		});

		expect(onSubmit).toHaveBeenCalledTimes(0);

		// but the day _is_ now selected
		expect(screen.getByTestId(testIdSelectedDay)).toBeInTheDocument();
	});
});
