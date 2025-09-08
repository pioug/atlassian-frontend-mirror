import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { EventType } from '@atlaskit/analytics-gas-types';
import FabricAnalyticsListeners, {
	type AnalyticsWebClient,
	FabricChannel,
} from '@atlaskit/analytics-listeners';
import type { AnalyticsEventPayload } from '@atlaskit/analytics-next';

interface AnalyticsTestUtilOptions {
	/** Additional setup before rendering */
	setup?: () => void;
	/** Optional mock client to use instead of creating a new one */
	mockClient?: AnalyticsWebClient;
}

/**
 * Creates a mock analytics client for testing
 */
export const createMockAnalyticsClient = (): AnalyticsWebClient => ({
	sendUIEvent: jest.fn(),
	sendOperationalEvent: jest.fn(),
	sendTrackEvent: jest.fn(),
	sendScreenEvent: jest.fn(),
});

/**
 * Test utility for testing analytics payloads end-to-end.
 * Renders children with analytics listener and provides mock client for event verification.
 *
 * @example
 * ```tsx
 * const { user, mockClient, expectEventToBeFired } = renderWithAnalyticsListener({
 *   children: (
 *     <PeopleTeamsAnalyticsContext data={{ source: 'teamsApp' }}>
 *       <ButtonWithAnalytics eventType="ui" testId="button-with-analytics"/>
 *     </PeopleTeamsAnalyticsContext>
 *   )
 * });
 *
 * // Test triggers event however it needs to
 * const button = screen.getByTestId('button-with-analytics');
 * await act(() => user.click(button));
 *
 * // Option 1: Use the helper function
 * expectEventToBeFired('ui', {
 *   action: 'clicked',
 *   source: 'teamsApp',
 *   attributes: expect.objectContaining({
 *     packageName: expect.any(String)
 *   })
 * });
 *
 * // Option 2: Use mockClient directly for more control
 * expect(mockClient.sendUIEvent).toHaveBeenCalledWith(
 *   expect.objectContaining({ source: 'teamsApp' })
 * );
 * ```
 */
export const renderWithAnalyticsListener = (
	ui: React.ReactElement,
	options?: AnalyticsTestUtilOptions,
) => {
	const { setup, mockClient: providedMockClient } = options || {};

	if (setup) {
		setup();
	}

	const mockClient = providedMockClient || createMockAnalyticsClient();
	const user = userEvent.setup();

	const renderResult = render(
		React.createElement(
			FabricAnalyticsListeners,
			{
				excludedChannels: Object.values(FabricChannel).filter(
					(channel) => channel !== FabricChannel.peopleTeams,
				),
				client: mockClient,
			},
			ui,
		),
	);

	const expectEventToBeFired = (eventType: EventType, expectedPayload: AnalyticsEventPayload) => {
		const getMockForEventType = (type: EventType) => {
			switch (type) {
				case 'ui':
					return mockClient.sendUIEvent;
				case 'operational':
					return mockClient.sendOperationalEvent;
				case 'track':
					return mockClient.sendTrackEvent;
				case 'screen':
					return mockClient.sendScreenEvent;
				default:
					throw new Error(`Unsupported event type: ${type}`);
			}
		};

		const targetMock = getMockForEventType(eventType);
		expect(targetMock).toHaveBeenCalledWith(
			expect.objectContaining({
				...expectedPayload,
				attributes: expect.objectContaining(expectedPayload.attributes || {}),
			}),
		);
	};

	return {
		...renderResult,
		user,
		mockClient,
		expectEventToBeFired,
	};
};
