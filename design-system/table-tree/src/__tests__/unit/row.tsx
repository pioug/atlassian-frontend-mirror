import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';

import Cell from '../../components/cell';
import Row from '../../components/row';

describe('Row', () => {
	it('should fire an analytics event on expand', () => {
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

		fireEvent.click(button);

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
});
