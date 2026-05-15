import React from 'react';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { fireEvent, render } from '@atlassian/testing-library';

import * as SmartLinkEventsModule from '../../SmartLinkEvents/useSmartLinkEvents';
import { HyperlinkWithSmartLinkResolver } from '../HyperlinkResolver';

// Mock the analytics hook with a factory function that returns a jest mock
jest.mock('../../SmartLinkEvents/useSmartLinkEvents', () => ({
	useFire3PWorkflowsClickEvent: jest.fn().mockImplementation(() => {
		return jest.fn();
	}),
}));

// Mock the state helpers and hooks.
jest.mock('../../../state/helpers', () => ({
	getFirstPartyIdentifier: jest.fn().mockReturnValue('test-first-party-id'),
	getThirdPartyARI: jest.fn().mockReturnValue('ari:third-party:something/abc'),
	getServices: jest.fn().mockReturnValue([]),
}));

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(() => false),
}));
jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure', () => ({
	expValEqualsNoExposure: jest.fn(() => false),
}));

// Helper to dispatch a real `auxclick` MouseEvent (testing-library's fireEvent
// does not have a dedicated `auxClick` shorthand).
const fireAuxClickEvent = (element: HTMLElement | Element, button: number) => {
	fireEvent(element, new MouseEvent('auxclick', { button, bubbles: true, cancelable: true }));
};

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

	describe('middle/right click + exposure (linking_platform_track_non_primary_3p_clicks)', () => {
		const setExperimentEnabled = (enabled: boolean) => {
			(expValEquals as jest.Mock).mockImplementation(
				(name: string, _param: string, _defaultVal: boolean) =>
					name === 'linking_platform_track_non_primary_3p_clicks' ? enabled : false,
			);
			(expValEqualsNoExposure as jest.Mock).mockImplementation(
				(name: string, _param: string, _defaultVal: boolean) =>
					name === 'linking_platform_track_non_primary_3p_clicks' ? enabled : false,
			);
		};

		beforeEach(() => {
			(expValEquals as jest.Mock).mockReset().mockReturnValue(false);
			(expValEqualsNoExposure as jest.Mock).mockReset().mockReturnValue(false);

			jest
				.requireMock('../../../state/hooks/use-resolve-hyperlink')
				.default.mockImplementation(() => ({
					actions: { authorize: jest.fn() },
					state: {
						status: 'resolved',
						details: { meta: { definitionId: 'test-definition-id' } },
					},
				}));
		});

		ffTest.on('platform_smartlink_3pclick_analytics', '', () => {
			it('reads the experiment (firing exposure) exactly once when a 3P link successfully renders', () => {
				render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver href="https://atlassian.com">
							Click Me
						</HyperlinkWithSmartLinkResolver>
					</SmartCardProvider>,
				);

				expect(expValEquals).toHaveBeenCalledTimes(1);
				expect(expValEquals).toHaveBeenCalledWith(
					'linking_platform_track_non_primary_3p_clicks',
					'isEnabled',
					true,
				);
			});

			it('does NOT read the experiment (no exposure fired) when the link fails to resolve', () => {
				jest
					.requireMock('../../../state/hooks/use-resolve-hyperlink')
					.default.mockImplementation(() => ({
						actions: { authorize: jest.fn() },
						state: {
							status: 'resolving',
							details: { meta: { definitionId: 'test-definition-id' } },
						},
					}));

				render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver href="https://atlassian.com">
							Click Me
						</HyperlinkWithSmartLinkResolver>
					</SmartCardProvider>,
				);

				expect(expValEquals).not.toHaveBeenCalled();
			});

			it('fires 3P click event with isAuxClick=true on a true middle-click when experiment is enabled', () => {
				const mockFireEvent = jest.fn();
				(SmartLinkEventsModule.useFire3PWorkflowsClickEvent as jest.Mock).mockReturnValue(
					mockFireEvent,
				);
				setExperimentEnabled(true);

				const { getByText } = render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver href="https://atlassian.com">
							Click Me
						</HyperlinkWithSmartLinkResolver>
					</SmartCardProvider>,
				);

				// Middle click: button === 1
				fireAuxClickEvent(getByText('Click Me'), 1);

				expect(mockFireEvent).toHaveBeenCalledTimes(1);
				expect(mockFireEvent).toHaveBeenCalledWith({ isAuxClick: true });
				// Click handlers must use the no-exposure variant so per-click reads
				// do not inflate exposure counts.
				expect(expValEqualsNoExposure).toHaveBeenCalledWith(
					'linking_platform_track_non_primary_3p_clicks',
					'isEnabled',
					true,
				);
			});

			it('does NOT fire 3P click event from onAuxClick when button is NOT 1 (Windows right-click safety)', () => {
				const mockFireEvent = jest.fn();
				(SmartLinkEventsModule.useFire3PWorkflowsClickEvent as jest.Mock).mockReturnValue(
					mockFireEvent,
				);
				setExperimentEnabled(true);

				const { getByText } = render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver href="https://atlassian.com">
							Click Me
						</HyperlinkWithSmartLinkResolver>
					</SmartCardProvider>,
				);

				// Right-click on Windows can fire onAuxClick with button === 2
				fireAuxClickEvent(getByText('Click Me'), 2);

				expect(mockFireEvent).not.toHaveBeenCalled();
			});

			it('fires 3P click event with isContextMenu=true on right-click when experiment is enabled', () => {
				const mockFireEvent = jest.fn();
				(SmartLinkEventsModule.useFire3PWorkflowsClickEvent as jest.Mock).mockReturnValue(
					mockFireEvent,
				);
				setExperimentEnabled(true);

				const { getByText } = render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver href="https://atlassian.com">
							Click Me
						</HyperlinkWithSmartLinkResolver>
					</SmartCardProvider>,
				);

				fireEvent.contextMenu(getByText('Click Me'));

				expect(mockFireEvent).toHaveBeenCalledTimes(1);
				expect(mockFireEvent).toHaveBeenCalledWith({ isContextMenu: true });
			});

			it('does NOT fire middle/right-click events when experiment is disabled (exposure still fired on render)', () => {
				const mockFireEvent = jest.fn();
				(SmartLinkEventsModule.useFire3PWorkflowsClickEvent as jest.Mock).mockReturnValue(
					mockFireEvent,
				);
				setExperimentEnabled(false);

				const { getByText } = render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver href="https://atlassian.com">
							Click Me
						</HyperlinkWithSmartLinkResolver>
					</SmartCardProvider>,
				);

				fireAuxClickEvent(getByText('Click Me'), 1);
				fireEvent.contextMenu(getByText('Click Me'));

				expect(mockFireEvent).not.toHaveBeenCalled();
				// Exposure-firing read on render should still have happened so allocation is recorded.
				expect(expValEquals).toHaveBeenCalledWith(
					'linking_platform_track_non_primary_3p_clicks',
					'isEnabled',
					true,
				);
			});
		});

		ffTest.off('platform_smartlink_3pclick_analytics', '', () => {
			it('does NOT read the experiment or fire middle/right-click events when the analytics FF is off', () => {
				const mockFireEvent = jest.fn();
				(SmartLinkEventsModule.useFire3PWorkflowsClickEvent as jest.Mock).mockReturnValue(
					mockFireEvent,
				);
				setExperimentEnabled(true);

				const { getByText } = render(
					<SmartCardProvider client={new CardClient()}>
						<HyperlinkWithSmartLinkResolver href="https://atlassian.com">
							Click Me
						</HyperlinkWithSmartLinkResolver>
					</SmartCardProvider>,
				);

				fireAuxClickEvent(getByText('Click Me'), 1);
				fireEvent.contextMenu(getByText('Click Me'));

				expect(mockFireEvent).not.toHaveBeenCalled();
				expect(expValEquals).not.toHaveBeenCalled();
				expect(expValEqualsNoExposure).not.toHaveBeenCalled();
			});
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
