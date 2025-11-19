import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import * as SmartLinkEventsModule from '../../SmartLinkEvents/useSmartLinkEvents';
import { HyperlinkWithSmartLinkResolver } from '../HyperlinkResolver';

// Mock the analytics hook with a factory function that returns a jest mock
jest.mock('../../SmartLinkEvents/useSmartLinkEvents', () => ({
	useFire3PWorkflowsClickEvent: jest.fn().mockImplementation(() => {
		return jest.fn();
	}),
}));

// Mock the state helpers and hooks
jest.mock('../../../state/helpers', () => ({
	getFirstPartyIdentifier: jest.fn().mockReturnValue('test-first-party-id'),
	getThirdPartyARI: jest.fn().mockReturnValue('test-third-party-ari'),
	getServices: jest.fn().mockReturnValue([]),
}));

jest.mock('../../../state/hooks/use-resolve-hyperlink', () => ({
	__esModule: true,
	default: jest.fn().mockImplementation(() => ({
		actions: {
			authorize: jest.fn(),
		},
		state: {
			status: 'resolved', // Default to resolved, we'll override in specific tests
			details: { meta: { definitionId: 'test-definition-id' } },
		},
	})),
}));

// Mock resolve hyperlink validator
jest.mock('../../../state/hooks/use-resolve-hyperlink/useResolveHyperlinkValidator', () => ({
	__esModule: true,
	default: jest.fn().mockReturnValue(true),
	isGoogleDomain: jest.fn().mockReturnValue(false),
	isSharePointDomain: jest.fn().mockReturnValue(false),
}));

describe('HyperlinkResolver - 3P Click Events', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		// Override the mock for useResolveHyperlink to return resolved state
		jest
			.requireMock('../../../state/hooks/use-resolve-hyperlink')
			.default.mockImplementation(() => ({
				actions: { authorize: jest.fn() },
				state: {
					status: 'resolved',
					details: { meta: { definitionId: 'test-definition-id' } },
				},
			}));

		// Render the component
		const { container } = render(
			<SmartCardProvider client={new CardClient()}>
				<HyperlinkWithSmartLinkResolver href="https://atlassian.com">
					Click Me
				</HyperlinkWithSmartLinkResolver>
			</SmartCardProvider>,
		);

		await expect(container).toBeAccessible();
	});

	ffTest.on('platform_smartlink_3pclick_analytics', '', () => {
		it('fires 3P click event when status is resolved, primary button is clicked, and FF is on', () => {
			// Create a mock for the fire3PClickEvent function
			const mockFireEvent = jest.fn();

			// Set up the fire3PClickEvent mock to return our mock function
			(SmartLinkEventsModule.useFire3PWorkflowsClickEvent as jest.Mock).mockReturnValue(
				mockFireEvent,
			);

			// Override the mock for useResolveHyperlink to return resolved state
			jest
				.requireMock('../../../state/hooks/use-resolve-hyperlink')
				.default.mockImplementation(() => ({
					actions: { authorize: jest.fn() },
					state: {
						status: 'resolved',
						details: { meta: { definitionId: 'test-definition-id' } },
					},
				}));

			// Render the component
			const { getByText } = render(
				<SmartCardProvider client={new CardClient()}>
					<HyperlinkWithSmartLinkResolver href="https://atlassian.com">
						Click Me
					</HyperlinkWithSmartLinkResolver>
				</SmartCardProvider>,
			);

			// Simulate a left click (button = 0)
			fireEvent.click(getByText('Click Me'), { button: 0 });

			// Verify the event was fired
			expect(mockFireEvent).toHaveBeenCalled();
		});
	});

	ffTest.on('platform_smartlink_3pclick_analytics', '', () => {
		it('does not fire 3P click event when status is not resolved', () => {
			// Create a mock for the fire3PClickEvent function
			const mockFireEvent = jest.fn();

			// Set up the fire3PClickEvent mock to return our mock function
			(SmartLinkEventsModule.useFire3PWorkflowsClickEvent as jest.Mock).mockReturnValue(
				mockFireEvent,
			);

			// Override the mock for useResolveHyperlink to return non-resolved state
			jest
				.requireMock('../../../state/hooks/use-resolve-hyperlink')
				.default.mockImplementation(() => ({
					actions: { authorize: jest.fn() },
					state: {
						status: 'resolving', // Not resolved
						details: { meta: { definitionId: 'test-definition-id' } },
					},
				}));

			// Render the component
			const { getByText } = render(
				<SmartCardProvider client={new CardClient()}>
					<HyperlinkWithSmartLinkResolver href="https://atlassian.com">
						Click Me
					</HyperlinkWithSmartLinkResolver>
				</SmartCardProvider>,
			);

			// Simulate a left click (button = 0)
			fireEvent.click(getByText('Click Me'), { button: 0 });

			// Verify the event was NOT fired since status is not resolved
			expect(mockFireEvent).not.toHaveBeenCalled();
		});
	});

	ffTest.on('platform_smartlink_3pclick_analytics', '', () => {
		it('does not fire 3P click event when non-primary button is clicked', () => {
			// Create a mock for the fire3PClickEvent function
			const mockFireEvent = jest.fn();

			// Set up the fire3PClickEvent mock to return our mock function
			(SmartLinkEventsModule.useFire3PWorkflowsClickEvent as jest.Mock).mockReturnValue(
				mockFireEvent,
			);

			// Override the mock for useResolveHyperlink to return resolved state
			jest
				.requireMock('../../../state/hooks/use-resolve-hyperlink')
				.default.mockImplementation(() => ({
					actions: { authorize: jest.fn() },
					state: {
						status: 'resolved',
						details: { meta: { definitionId: 'test-definition-id' } },
					},
				}));

			// Render the component
			const { getByText } = render(
				<SmartCardProvider client={new CardClient()}>
					<HyperlinkWithSmartLinkResolver href="https://atlassian.com">
						Click Me
					</HyperlinkWithSmartLinkResolver>
				</SmartCardProvider>,
			);

			// First do a regular click to ensure feature flag is checked
			fireEvent.click(getByText('Click Me'), { button: 0 });

			// Reset the mocks
			mockFireEvent.mockClear();

			// Now simulate a right click (button = 2)
			fireEvent.click(getByText('Click Me'), { button: 2 });

			// Verify the event was NOT fired since button is not primary
			expect(mockFireEvent).not.toHaveBeenCalled();
		});
	});

	ffTest.off('platform_smartlink_3pclick_analytics', '', () => {
		it('does not fire 3P click event when feature flag is off', () => {
			// Create a mock for the fire3PClickEvent function
			const mockFireEvent = jest.fn();

			// Set up the fire3PClickEvent mock to return our mock function
			(SmartLinkEventsModule.useFire3PWorkflowsClickEvent as jest.Mock).mockReturnValue(
				mockFireEvent,
			);

			// Override the mock for useResolveHyperlink to return resolved state
			jest
				.requireMock('../../../state/hooks/use-resolve-hyperlink')
				.default.mockImplementation(() => ({
					actions: { authorize: jest.fn() },
					state: {
						status: 'resolved',
						details: { meta: { definitionId: 'test-definition-id' } },
					},
				}));

			// Render the component
			const { getByText } = render(
				<SmartCardProvider client={new CardClient()}>
					<HyperlinkWithSmartLinkResolver href="https://atlassian.com">
						Click Me
					</HyperlinkWithSmartLinkResolver>
				</SmartCardProvider>,
			);

			// Simulate a left click (button = 0)
			fireEvent.click(getByText('Click Me'), { button: 0 });

			// Verify the event was NOT fired since feature flag is off
			expect(mockFireEvent).not.toHaveBeenCalled();
		});
	});

	ffTest.on('platform_smartlink_3pclick_analytics', '', () => {
		it('propagates the onClick callback when provided', () => {
			// Create a mock for the fire3PClickEvent function
			const mockFireEvent = jest.fn();

			// Set up the fire3PClickEvent mock to return our mock function
			(SmartLinkEventsModule.useFire3PWorkflowsClickEvent as jest.Mock).mockReturnValue(
				mockFireEvent,
			);

			// Create a mock for the onClick callback
			const onClickMock = jest.fn();

			// Override the mock for useResolveHyperlink to return resolved state
			jest
				.requireMock('../../../state/hooks/use-resolve-hyperlink')
				.default.mockImplementation(() => ({
					actions: { authorize: jest.fn() },
					state: {
						status: 'resolved',
						details: { meta: { definitionId: 'test-definition-id' } },
					},
				}));

			// Render the component with onClick prop
			const { getByText } = render(
				<SmartCardProvider client={new CardClient()}>
					<HyperlinkWithSmartLinkResolver href="https://atlassian.com" onClick={onClickMock}>
						Click Me
					</HyperlinkWithSmartLinkResolver>
				</SmartCardProvider>,
			);

			// Simulate a left click (button = 0)
			fireEvent.click(getByText('Click Me'), { button: 0 });

			// Verify both the 3P click event and the onClick callback were fired
			expect(mockFireEvent).toHaveBeenCalled();
			expect(onClickMock).toHaveBeenCalled();
		});
	});
});
