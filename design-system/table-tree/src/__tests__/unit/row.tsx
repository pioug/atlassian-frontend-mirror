import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';

import Cell from '../../components/cell';
import Row from '../../components/row';

describe('Row', () => {
	it('should fire an analytics event on expand', async () => {
		const user = userEvent.setup();
		const onEvent = jest.fn();

		render(
			<AnalyticsListener channel="atlaskit" onEvent={onEvent}>
				<Row onExpand={__noop} hasChildren data={{ id: 'test' }}>
					<Cell>Test</Cell>
				</Row>
			</AnalyticsListener>,
		);

		const button: HTMLElement = screen.getByRole('button', {
			name: /expand/i,
		});

		await user.click(button);

		const expected = new UIAnalyticsEvent({
			payload: {
				action: 'expanded',
				actionSubject: 'tableTree',
				attributes: {
					componentName: 'row',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			},
			context: [
				{
					componentName: 'row',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			],
		});

		expect(onEvent).toHaveBeenCalledTimes(2);
		expect(onEvent.mock.calls[1][0].payload).toEqual(expected.payload);
		expect(onEvent.mock.calls[1][0].context).toEqual(expected.context);
	});

	it('should prevent event propagation from chevron to row', async () => {
		const user = userEvent.setup();

		// Don't provide onExpand - this is unmanaged mode where double firing of onExpand can update the state twice
		render(
			<Row hasChildren data={{ id: 'test' }} shouldExpandOnClick>
				<Cell>Test Cell Content</Cell>
			</Row>,
		);

		let button: HTMLElement = screen.getByRole('button', {
			name: /expand/i,
		});
		expect(button).toBeInTheDocument();

		// Click the chevron button
		await user.click(button);

		// After clicking, should show "Collapse" button (expanded state)
		button = screen.getByRole('button', {
			name: /collapse/i,
		});
		expect(button).toBeInTheDocument();

		// Click again to collapse
		await user.click(button);

		// Should be back to "Expand" button (collapsed state)
		button = screen.getByRole('button', {
			name: /expand/i,
		});
		expect(button).toBeInTheDocument();
	});
});
