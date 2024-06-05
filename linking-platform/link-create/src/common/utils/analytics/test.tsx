import React from 'react';

import { AnalyticsListener, useAnalyticsEvents } from '@atlaskit/analytics-next';
import { renderWithIntl as render } from '@atlaskit/link-test-helpers';

import { ANALYTICS_CHANNEL } from '../../constants';

import { withLinkCreateAnalyticsContext } from './index';
describe('withLinkCreateAnalyticsContext', () => {
	const EVENT_PAYLOAD = {
		action: 'fired',
		actionSubject: 'event',
	};

	const TestComponent = ({
		entityKey,
	}: {
		groupKey?: string;
		entityKey: string;
		triggeredFrom: string;
	}) => {
		const { createAnalyticsEvent } = useAnalyticsEvents();
		const event = createAnalyticsEvent(EVENT_PAYLOAD);
		event.fire(ANALYTICS_CHANNEL);
		return <div data-testid="test-component">{entityKey}</div>;
	};

	const ComposedComponent = withLinkCreateAnalyticsContext(TestComponent);

	const setup = (
		props: React.ComponentProps<typeof ComposedComponent> = {
			entityKey: 'confluence-page',
			triggeredFrom: 'test',
		},
	) => {
		const spy = jest.fn();

		render(
			<AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={spy}>
				<ComposedComponent {...props} />
			</AnalyticsListener>,
		);

		return { spy };
	};

	it('provides `objectName` attributes as `confluence-page`', () => {
		const { spy } = setup();

		expect(spy).toHaveBeenCalledWith(
			expect.objectContaining({
				payload: {
					...EVENT_PAYLOAD,
					attributes: expect.objectContaining({
						objectName: 'confluence-page',
					}),
				},
			}),
			ANALYTICS_CHANNEL,
		);
	});

	it('provides `triggeredFrom` attributes as `test`', () => {
		const { spy } = setup();

		expect(spy).toHaveBeenCalledWith(
			expect.objectContaining({
				payload: {
					...EVENT_PAYLOAD,
					attributes: expect.objectContaining({
						triggeredFrom: 'test',
					}),
				},
			}),
			ANALYTICS_CHANNEL,
		);
	});
});
