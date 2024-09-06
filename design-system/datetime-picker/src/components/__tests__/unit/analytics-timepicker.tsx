import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';

import TimePicker from '../../time-picker';

const attributes = {
	componentName: 'timePicker',
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

describe('TimePicker', () => {
	it(`should fire an event on internal channel when value is changed`, async () => {
		const user = userEvent.setup();
		const onAtlaskitEvent = jest.fn();
		render(
			<AnalyticsListener onEvent={onAtlaskitEvent} channel="atlaskit">
				<div>
					<label htmlFor="time">
						Time
						<TimePicker id="time" onChange={__noop} />
					</label>
				</div>
			</AnalyticsListener>,
		);
		const timePickerInput = screen.getByRole('combobox') as HTMLTextAreaElement;
		const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
			payload: {
				action: 'selectedTime',
				actionSubject: 'timePicker',
				attributes,
			},
		});
		await user.type(timePickerInput, '11:00{Enter}');
		const mock: jest.Mock = onAtlaskitEvent;
		// Once for select's option change and once for time picker's balue change
		expect(mock).toHaveBeenCalledTimes(2);
		const timePickerEvent = mock.mock.calls.find(
			(call) => call[0].payload.actionSubject === attributes.componentName,
		);
		expect(timePickerEvent[0].payload).toEqual(expected.payload);
	});
});
