import React from 'react';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';

import DateTimePicker from '../../date-time-picker';

const attributes = {
	componentName: 'dateTimePicker',
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('DateTimePicker', () => {
	const testId = 'testId';

	it(`should fire an event on internal channel when value is changed`, async () => {
		const user = userEvent.setup();
		const onAtlaskitEvent = jest.fn();
		render(
			<AnalyticsListener onEvent={onAtlaskitEvent} channel="atlaskit">
				<div>
					<label htmlFor="time">
						Time
						<DateTimePicker id="datetime" testId={testId} onChange={__noop} />
					</label>
				</div>
			</AnalyticsListener>,
		);
		const datePickerInput = within(
			screen.getByTestId(`${testId}--datepicker--container`),
		).getByRole('combobox') as HTMLInputElement;
		const timePickerInput = within(
			screen.getByTestId(`${testId}--timepicker--container`),
		).getByRole('combobox') as HTMLInputElement;
		const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
			payload: {
				action: 'changed',
				actionSubject: 'dateTimePicker',
				attributes,
			},
		});
		await user.type(datePickerInput, '1/1/2001{Enter}');
		await user.type(timePickerInput, '11:00{Enter}');
		const mock: jest.Mock = onAtlaskitEvent;
		// Once for each underlying component change and once for each datetime picker change
		expect(mock).toHaveBeenCalledTimes(4);
		const dateTimePickerEvents = mock.mock.calls.filter(
			(call) => call[0].payload.actionSubject === attributes.componentName,
		);
		dateTimePickerEvents.forEach((e) => expect(e[0].payload).toEqual(expected.payload));
	});
});
