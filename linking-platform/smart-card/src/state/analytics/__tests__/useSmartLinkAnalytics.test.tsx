import React from 'react';

import { renderHook } from '@testing-library/react-hooks';

import '@atlaskit/link-test-helpers/jest';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import { useSmartLinkAnalytics } from '../useSmartLinkAnalytics';
import { mocks } from '../../../utils/mocks';
import { ANALYTICS_CHANNEL } from '../../../utils/analytics';
import { CardDisplay } from '../../../constants';
import { TrackQuickActionType } from '../../../utils/analytics/analytics';

jest.mock('@atlaskit/link-provider', () => ({
	useSmartLinkContext: () => ({
		store: { getState: () => ({ 'test-url': mocks.analytics }) },
	}),
}));

const url = 'test-url';

describe('useSmartLinkAnalytics', () => {
	it('fires a specified event', () => {
		const spy = jest.fn();

		const { result } = renderHook(() => useSmartLinkAnalytics(url), {
			wrapper: ({ children }) => (
				<AnalyticsListener onEvent={spy} channel={ANALYTICS_CHANNEL}>
					{children}
				</AnalyticsListener>
			),
		});

		result.current.ui.cardClickedEvent({
			id: 'test-id',
			display: CardDisplay.Flexible,
			status: 'resolved',
		});

		expect(spy).toHaveBeenCalledWith(
			expect.objectContaining({
				payload: {
					action: 'clicked',
					actionSubject: 'smartLink',
					attributes: {
						id: 'test-id',
						componentName: 'smart-cards',
						display: 'flexible',
						definitionId: 'spaghetti-id',
						extensionKey: 'spaghetti-key',
						destinationProduct: 'spaghetti-product',
						destinationSubproduct: 'spaghetti-subproduct',
						packageName: expect.any(String),
						packageVersion: expect.any(String),
						status: 'resolved',
						resourceType: 'spaghetti-resource',
						destinationObjectType: 'spaghetti-resource',
					},
					eventType: 'ui',
				},
			}),
			ANALYTICS_CHANNEL,
		);
	});

	it.each([
		['smartLinkLozengeActionClickedEvent', 'ui', 'button', 'clicked', 'smartLinkStatusLozenge'],
		[
			'smartLinkLozengeActionListItemClickedEvent',
			'ui',
			'button',
			'clicked',
			'smartLinkStatusListItem',
		],
		[
			'smartLinkLozengeActionErrorOpenPreviewClickedEvent',
			'ui',
			'button',
			'clicked',
			'smartLinkStatusOpenPreview',
		],
	])(
		'action ui event %s fires with expected payload',
		(eventName, eventType, actionSubject, action, actionSubjectId) => {
			const spy = jest.fn();

			const { result } = renderHook(() => useSmartLinkAnalytics(url), {
				wrapper: ({ children }) => (
					<AnalyticsListener onEvent={spy} channel={ANALYTICS_CHANNEL}>
						{children}
					</AnalyticsListener>
				),
			});
			const event = (result.current as any)[eventType][eventName] as any;

			event();
			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: {
						action,
						actionSubject,
						actionSubjectId,
						attributes: {
							componentName: 'smart-cards',
							definitionId: 'spaghetti-id',
							extensionKey: 'spaghetti-key',
							destinationProduct: 'spaghetti-product',
							destinationSubproduct: 'spaghetti-subproduct',
							packageName: expect.any(String),
							packageVersion: expect.any(String),
							resourceType: 'spaghetti-resource',
							destinationObjectType: 'spaghetti-resource',
							location: undefined,
							id: 'NULL',
						},
						eventType,
					},
				}),
				ANALYTICS_CHANNEL,
			);
		},
	);

	it.each([
		['smartLinkQuickActionStarted', 'track', 'smartLinkQuickAction', 'started'],
		['smartLinkQuickActionSuccess', 'track', 'smartLinkQuickAction', 'success'],
		['smartLinkQuickActionFailed', 'track', 'smartLinkQuickAction', 'failed'],
		['smartLinkQuickActionStarted', 'track', 'smartLinkQuickAction', 'started'],
		['smartLinkQuickActionSuccess', 'track', 'smartLinkQuickAction', 'success'],
		['smartLinkQuickActionFailed', 'track', 'smartLinkQuickAction', 'failed'],
	])(
		'action track event %s fires with expected payload',
		(eventName, eventType, actionSubject, action) => {
			const smartLinkActionType = TrackQuickActionType.StatusUpdate;
			const spy = jest.fn();

			const { result } = renderHook(() => useSmartLinkAnalytics(url), {
				wrapper: ({ children }) => (
					<AnalyticsListener onEvent={spy} channel={ANALYTICS_CHANNEL}>
						{children}
					</AnalyticsListener>
				),
			});
			const event = (result.current as any)[eventType][eventName] as any;
			event({ smartLinkActionType });
			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: {
						action,
						actionSubject,
						attributes: {
							componentName: 'smart-cards',
							definitionId: 'spaghetti-id',
							extensionKey: 'spaghetti-key',
							destinationProduct: 'spaghetti-product',
							destinationSubproduct: 'spaghetti-subproduct',
							packageName: expect.any(String),
							packageVersion: expect.any(String),
							resourceType: 'spaghetti-resource',
							destinationObjectType: 'spaghetti-resource',
							location: undefined,
							id: 'NULL',
							smartLinkActionType,
						},
						eventType,
					},
				}),
				ANALYTICS_CHANNEL,
			);
		},
	);

	describe('without `dispatchAnalytics`', () => {
		it('fires a specified event using @atlaskit/analytics-next if no dispatch handler is provided', () => {
			const spy = jest.fn();

			const { result } = renderHook(() => useSmartLinkAnalytics(url), {
				wrapper: ({ children }) => (
					<AnalyticsListener onEvent={spy} channel={ANALYTICS_CHANNEL}>
						{children}
					</AnalyticsListener>
				),
			});

			result.current.ui.cardClickedEvent({
				id: 'test-id',
				display: CardDisplay.Flexible,
				status: 'resolved',
			});

			expect(spy).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'clicked',
					actionSubject: 'smartLink',
					attributes: {
						id: 'test-id',
						componentName: 'smart-cards',
						display: 'flexible',
						definitionId: 'spaghetti-id',
						extensionKey: 'spaghetti-key',
						destinationProduct: 'spaghetti-product',
						destinationSubproduct: 'spaghetti-subproduct',
						packageName: '@product/platform',
						packageVersion: '0.0.0',
						status: 'resolved',
						resourceType: 'spaghetti-resource',
					},
					eventType: 'ui',
				},
			});
		});
	});
});
