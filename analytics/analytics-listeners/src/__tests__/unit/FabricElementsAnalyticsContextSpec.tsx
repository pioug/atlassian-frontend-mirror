import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { FabricChannel } from '../../types';
import { createDummyComponentWithAnalytics } from '../_testUtils';

const ElementsComponentWithAnalytics = createDummyComponentWithAnalytics(FabricChannel.elements);

describe('<FabricElementsAnalyticsContext />', () => {
	it('should fire event with Fabric Elements contextual data', () => {
		const compOnClick = jest.fn();
		const listenerHandler = jest.fn();

		render(
			<AnalyticsListener onEvent={listenerHandler} channel={FabricChannel.elements}>
				<FabricElementsAnalyticsContext data={{ greeting: 'hello' }}>
					<ElementsComponentWithAnalytics onClick={compOnClick} />
				</FabricElementsAnalyticsContext>
			</AnalyticsListener>,
		);

		const dummyButton = screen.getByRole('button', { name: 'Test' });
		fireEvent.click(dummyButton);

		expect(listenerHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				context: [{ fabricElementsCtx: { greeting: 'hello' } }],
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
			FabricChannel.elements,
		);
	});
});
