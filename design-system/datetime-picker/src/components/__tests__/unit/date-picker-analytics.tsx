import React from 'react';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';

import DatePicker from '../../date-picker-fc';

const getAllDays = () => {
	let allDays: HTMLElement[] = [];
	screen.getAllByRole('gridcell').forEach((gridCell) => {
		allDays = allDays.concat(within(gridCell).getAllByRole('button'));
	});
	return allDays;
};

describe('DatePicker', () => {
	it('should fire an analytics event', async () => {
		const onEvent = jest.fn();
		const user = userEvent.setup();

		render(
			<AnalyticsListener channel="atlaskit" onEvent={onEvent}>
				<DatePicker label="Date" testId="test" value="2018-06-08" />
			</AnalyticsListener>,
		);

		await user.click(screen.getByTestId('test--container'));
		const days = getAllDays();
		const selectedDay = screen.getByTestId(`test--calendar--selected-day`);
		const selectedIndex = days.findIndex((day) => day === selectedDay);
		const nextDay = days[selectedIndex + 1];

		await user.click(nextDay);

		const expected = new UIAnalyticsEvent({
			payload: {
				action: 'selectedDate',
				actionSubject: 'datePicker',
				attributes: {
					componentName: 'datePicker',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			},
			context: [
				{
					componentName: 'datePicker',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			],
		});

		// first call is from calendar component. Second one is our.
		expect(onEvent).toHaveBeenCalledTimes(2);
		expect(onEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				payload: expected.payload,
				context: expected.context,
			}),
			'atlaskit',
		);
		expect(onEvent.mock.calls[1][0].payload).toEqual(expected.payload);
		expect(onEvent.mock.calls[1][0].context).toEqual(expected.context);
	});

	it('should export analytics event to onClick handler', async () => {
		const onChangeMock = jest.fn();
		const user = userEvent.setup();

		render(<DatePicker label="Date" testId="test" value="2018-06-08" onChange={onChangeMock} />);

		await user.click(screen.getByTestId('test--container'));
		const days = getAllDays();
		const selectedDay = screen.getByTestId(`test--calendar--selected-day`);
		const selectedIndex = days.findIndex((day) => day === selectedDay);
		const nextDay = days[selectedIndex + 1];

		await user.click(nextDay);

		const expected = new UIAnalyticsEvent({
			payload: {
				action: 'selectedDate',
				actionSubject: 'datePicker',
				attributes: {
					componentName: 'datePicker',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			},
			context: [
				{
					componentName: 'datePicker',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			],
		});

		expect(onChangeMock).toHaveBeenCalledTimes(1);
		expect(onChangeMock).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				payload: expected.payload,
				context: expected.context,
			}),
		);
	});
});
