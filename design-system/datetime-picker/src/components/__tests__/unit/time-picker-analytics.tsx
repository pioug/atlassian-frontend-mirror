import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';
import Select, { type OptionsType } from '@atlaskit/select';

import TimePicker from '../../time-picker';

jest.mock('@atlaskit/select', () => {
	const actual = jest.requireActual('@atlaskit/select');

	return {
		__esModule: true,
		...actual,
		default: jest.fn(),
	};
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('TimePicker', () => {
	beforeEach(() => {
		(Select as unknown as jest.Mock).mockImplementation((props) => {
			const options: OptionsType = props.options || [];

			return (
				<select
					{...props}
					onChange={(event) => props.onChange(event.target.value, 'select-option')}
					data-testid={`${props.testId}--select`}
				>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
					<option value=""></option>
				</select>
			);
		});
	});
	it('should fire an analytics event', async () => {
		const onEvent = jest.fn();
		const user = userEvent.setup();

		render(
			<AnalyticsListener channel="atlaskit" onEvent={onEvent}>
				<TimePicker label="Time" testId="test" onChange={__noop} />
			</AnalyticsListener>,
		);

		const select = screen.getByTestId('test--select');
		await user.selectOptions(select, '12:00');

		const expected = new UIAnalyticsEvent({
			payload: {
				action: 'selectedTime',
				actionSubject: 'timePicker',
				attributes: {
					componentName: 'timePicker',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			},
			context: [
				{
					componentName: 'timePicker',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			],
		});

		expect(onEvent).toHaveBeenCalledTimes(1);
		expect(onEvent.mock.calls[0][0].payload).toEqual(expected.payload);
		expect(onEvent.mock.calls[0][0].context).toEqual(expected.context);
	});

	it('should export analytics event to onClick handler', async () => {
		const onClick = jest.fn();
		const user = userEvent.setup();

		render(<TimePicker label="Time" testId="test" onChange={onClick} />);

		const select = screen.getByTestId('test--select');
		await user.selectOptions(select, '12:00');

		const expected = new UIAnalyticsEvent({
			payload: {
				action: 'selectedTime',
				actionSubject: 'timePicker',
				attributes: {
					componentName: 'timePicker',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			},
			context: [
				{
					componentName: 'timePicker',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			],
		});

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				payload: expected.payload,
				context: expected.context,
			}),
		);
	});
});
