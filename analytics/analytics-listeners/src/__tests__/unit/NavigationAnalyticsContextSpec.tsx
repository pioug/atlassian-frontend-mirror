import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { FabricChannel } from '../../types';
import { createDummyComponentWithAnalytics } from '../_testUtils';

const NavigationComponentWithAnalytics = createDummyComponentWithAnalytics(
	FabricChannel.navigation,
);

describe('<NavigationAnalyticsContext />', () => {
	it('should fire event with Navigation contextual data', () => {
		const compOnClick = jest.fn();
		const listenerHandler = jest.fn();

		render(
			<AnalyticsListener onEvent={listenerHandler} channel={FabricChannel.navigation}>
				<NavigationAnalyticsContext data={{ greeting: 'hello' }}>
					<NavigationComponentWithAnalytics onClick={compOnClick} />
				</NavigationAnalyticsContext>
			</AnalyticsListener>,
		);

		const dummyButton = screen.getByRole('button', { name: 'Test' });
		fireEvent.click(dummyButton);

		expect(listenerHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				context: [{ navigationCtx: { greeting: 'hello' } }],
				payload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					attributes: {
						componentName: 'foo',
						foo: 'bar',
						packageName: '@atlaskit/foo',
						packageVersion: '1.0.0',
					},
					eventType: 'ui',
				},
			}),
			FabricChannel.navigation,
		);
	});
});
