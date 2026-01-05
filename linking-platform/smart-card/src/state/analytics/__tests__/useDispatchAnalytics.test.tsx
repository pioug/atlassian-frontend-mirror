import React from 'react';

import { renderHook } from '@testing-library/react';

import '@atlaskit/link-test-helpers/jest';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../../../utils/analytics';
import { useDispatchAnalytics } from '../useDispatchAnalytics';

describe('useDispatchAnalytics', () => {
	const payload = {
		action: 'clicked',
		actionSubject: 'link',
		attributes: {},
		eventType: 'ui',
	} as const;

	it('should return the `handler` if provided as `dispatchAnalytics`', () => {
		const dispatch = jest.fn();
		const { result } = renderHook(() => useDispatchAnalytics(dispatch));
		const { dispatchAnalytics } = result.current;

		dispatchAnalytics(payload);

		expect(dispatch).toHaveBeenCalledTimes(1);
		expect(dispatch).toHaveBeenCalledWith(payload);
	});

	it('should return a function that fires an event using `createAnalyticsEvents` on `media` channel if no `handler` is provided', () => {
		const spy = jest.fn();

		const { result } = renderHook(() => useDispatchAnalytics(), {
			wrapper: ({ children }) => (
				<AnalyticsListener onEvent={spy} channel={ANALYTICS_CHANNEL}>
					{children}
				</AnalyticsListener>
			),
		});
		const { dispatchAnalytics } = result.current;

		dispatchAnalytics(payload);

		expect(spy).toBeFiredWithAnalyticEventOnce({
			payload,
		});
	});
});
