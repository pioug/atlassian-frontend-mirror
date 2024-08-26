import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';

import ActionItem from '../../action-item';

describe('ActionItem', () => {
	it('should fire an analytics event', () => {
		const onEvent = jest.fn();

		render(
			<AnalyticsListener channel="atlaskit" onEvent={onEvent}>
				<ActionItem onClick={__noop} />
			</AnalyticsListener>,
		);

		const field: HTMLElement = screen.getByRole('presentation');

		fireEvent.click(field);

		const expected = new UIAnalyticsEvent({
			payload: {
				action: 'clicked',
				actionSubject: 'commentAction',
				attributes: {
					componentName: 'commentAction',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			},
			context: [
				{
					componentName: 'commentAction',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			],
		});

		expect(onEvent).toHaveBeenCalledTimes(1);
		expect(onEvent.mock.calls[0][0].payload).toEqual(expected.payload);
		expect(onEvent.mock.calls[0][0].context).toEqual(expected.context);
	});

	it('should export analytics event to onClick handler', () => {
		const onClick = jest.fn();

		render(<ActionItem onClick={onClick} />);

		const field: HTMLElement = screen.getByRole('presentation');

		fireEvent.click(field);

		const expected = new UIAnalyticsEvent({
			payload: {
				action: 'clicked',
				actionSubject: 'commentAction',
				attributes: {
					componentName: 'commentAction',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			},
			context: [
				{
					componentName: 'commentAction',
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
