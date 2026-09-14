import React, { useEffect } from 'react';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { render } from '@atlassian/testing-library';

import '@atlaskit/link-test-helpers/jest';

import { LinkAnalyticsContext } from '../LinkAnalyticsContext';

describe('LinkAnalyticsContext', () => {
	const payload = {
		action: 'fired',
		actionSubject: 'event',
	};

	const DummyComponent = () => {
		const { createAnalyticsEvent } = useAnalyticsEvents();

		useEffect(() => {
			createAnalyticsEvent(payload).fire('media');
		}, [createAnalyticsEvent]);

		return null;
	};

	it('should add analytics context to events based on url', async () => {
		const source = 'fooScreen';
		const display = 'url';
		const id = 'fooId';
		const spy = jest.fn();

		render(
			<AnalyticsListener onEvent={spy} channel="*">
				<LinkAnalyticsContext display={display} source={source} id={id}>
					<DummyComponent />
				</LinkAnalyticsContext>
			</AnalyticsListener>,
		);

		expect(spy).toBeFiredWithAnalyticEventOnce({
			payload,
			context: [
				{
					source,
					attributes: {
						displayCategory: 'link',
						display,
						id,
					},
				},
			],
		});

		await expect(document.body).toBeAccessible();
	});

	it('should not set displayCategory attribute if display is not url', async () => {
		const display = 'inline';
		const spy = jest.fn();

		render(
			<AnalyticsListener onEvent={spy} channel="*">
				<LinkAnalyticsContext display={display}>
					<DummyComponent />
				</LinkAnalyticsContext>
			</AnalyticsListener>,
		);

		expect(spy).toBeFiredWithAnalyticEventOnce({
			payload,
			context: [
				{
					attributes: {
						displayCategory: undefined,
						display,
					},
				},
			],
		});

		await expect(document.body).toBeAccessible();
	});
});
