import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';

import InlineDialog from '../../index';

describe('InlineDialog', () => {
	it('should fire an analytics event', () => {
		const onEvent = jest.fn();
		let isOpen = true;

		render(
			<AnalyticsListener channel="atlaskit" onEvent={onEvent}>
				<InlineDialog content={<div>content</div>} onClose={__noop} isOpen={isOpen}>
					<button type="button" onClick={() => !isOpen} data-testid="trigger">
						Click me!
					</button>
				</InlineDialog>
			</AnalyticsListener>,
		);

		const button: HTMLElement = screen.getByTestId('trigger');

		fireEvent.keyDown(button, { key: 'Escape', code: 'Escape' });

		const expected = new UIAnalyticsEvent({
			payload: {
				action: 'closed',
				actionSubject: 'inlineDialog',
				attributes: {
					componentName: 'inlineDialog',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			},
			context: [
				{
					componentName: 'inlineDialog',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			],
		});

		expect(onEvent).toHaveBeenCalledTimes(1);
		expect(onEvent.mock.calls[0][0].payload).toEqual(expected.payload);
		expect(onEvent.mock.calls[0][0].context).toEqual(expected.context);
	});
});
