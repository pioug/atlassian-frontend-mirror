import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { IntlProvider } from 'react-intl';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { UnAuthClient } from '@atlaskit/link-test-helpers';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { fireEvent, render } from '@atlassian/testing-library';

import { ANALYTICS_CHANNEL } from '../../../utils/analytics';
import * as SmartLinkEventsModule from '../../SmartLinkEvents/useSmartLinkEvents';
import { CardWithUrl } from '../component';

jest.mock('../../SmartLinkEvents/useSmartLinkEvents', () => ({
	useFire3PWorkflowsClickEvent: jest.fn(),
}));
jest.mock('../../../state/helpers', () => {
	const actual = jest.requireActual('../../../state/helpers');
	return {
		...actual,
		getThirdPartyARI: jest.fn().mockReturnValue('ari:third-party:something/abc'),
		getFirstPartyIdentifier: jest.fn().mockReturnValue('test-first-party-id'),
		getClickUrl: jest.fn((url: string) => url),
	};
});
jest.mock('../../../state', () => ({
	useSmartLink: jest.fn(() => ({
		state: {
			status: 'resolved',
			details: { meta: { definitionId: 'test-definition-id' }, data: {} },
		},
		actions: { authorize: jest.fn(), reload: jest.fn(), invoke: jest.fn() },
		config: {},
		renderers: undefined,
		error: undefined,
		isPreviewPanelAvailable: undefined,
		openPreviewPanel: undefined,
	})),
}));
jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(() => false),
}));
jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure', () => ({
	expValEqualsNoExposure: jest.fn(() => false),
}));

describe('CardWithUrl', () => {
	const setup = (CustomClient = UnAuthClient) => {
		const onEvent = jest.fn();

		const url = 'https://example.com';
		const card = <CardWithUrl appearance="inline" id="uid" url={url} />;
		const renderResult = render(card, {
			wrapper: ({ children }) => (
				<IntlProvider locale="en">
					<SmartCardProvider client={new CustomClient()}>
						<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
							{children}
						</AnalyticsListener>
					</SmartCardProvider>
				</IntlProvider>
			),
		});

		return { ...renderResult, card, onEvent };
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		const { container, unmount } = setup();
		await expect(container).toBeAccessible();
		unmount();
	});

	describe('middle / right clicks on inline card', () => {
		let mockFireEvent: jest.Mock;

		const NON_PRIMARY_EXPERIMENT = 'linking_platform_track_non_primary_3p_clicks';
		const SMARTLINK_3P_ANALYTICS_FF = 'platform_smartlink_3pclick_analytics';

		const renderResolved3P = () =>
			render(
				<IntlProvider locale="en">
					<SmartCardProvider client={new CardClient()}>
						<CardWithUrl appearance="inline" id="uid" url="https://example.com" />
					</SmartCardProvider>
				</IntlProvider>,
			);

		const fireAuxClick = (el: Element, button: number) =>
			fireEvent(el, new MouseEvent('auxclick', { button, bubbles: true, cancelable: true }));

		beforeEach(() => {
			mockFireEvent = jest.fn();
			(SmartLinkEventsModule.useFire3PWorkflowsClickEvent as jest.Mock).mockReturnValue(
				mockFireEvent,
			);
		});

		describe('with 3P analytics FF and experiment ON', () => {
			beforeEach(() => {
				passGate(SMARTLINK_3P_ANALYTICS_FF);
				(expValEqualsNoExposure as jest.Mock).mockReturnValue(true);
			});

			it('fires experiment exposure once on mount', () => {
				renderResolved3P();
				expect(expValEquals).toHaveBeenCalledWith(NON_PRIMARY_EXPERIMENT, 'isEnabled', true);
			});

			it('fires 3P click event with isAuxClick on middle click', () => {
				const { container } = renderResolved3P();
				fireAuxClick(container.querySelector('a')!, 1);
				expect(mockFireEvent).toHaveBeenCalledWith({ isAuxClick: true });
			});

			it('does NOT fire 3P click event for auxclick with button === 2 (Windows right-click safety)', () => {
				const { container } = renderResolved3P();
				fireAuxClick(container.querySelector('a')!, 2);
				expect(mockFireEvent).not.toHaveBeenCalled();
			});

			it('fires 3P click event with isContextMenu on right click', () => {
				const { container } = renderResolved3P();
				fireEvent.contextMenu(container.querySelector('a')!);
				expect(mockFireEvent).toHaveBeenCalledWith({ isContextMenu: true });
			});
		});

		describe('with 3P analytics FF ON but experiment OFF', () => {
			beforeEach(() => {
				passGate(SMARTLINK_3P_ANALYTICS_FF);
				(expValEqualsNoExposure as jest.Mock).mockReturnValue(false);
			});

			it('still fires experiment exposure on mount', () => {
				renderResolved3P();
				expect(expValEquals).toHaveBeenCalledWith(NON_PRIMARY_EXPERIMENT, 'isEnabled', true);
			});

			it('does NOT fire 3P click events on middle or right click', () => {
				const { container } = renderResolved3P();
				const link = container.querySelector('a')!;
				fireAuxClick(link, 1);
				fireEvent.contextMenu(link);
				expect(mockFireEvent).not.toHaveBeenCalled();
			});
		});

		describe('with 3P analytics FF OFF', () => {
			beforeEach(() => {
				failGate(SMARTLINK_3P_ANALYTICS_FF);
				(expValEqualsNoExposure as jest.Mock).mockReturnValue(true);
			});

			it('does NOT fire experiment exposure on mount', () => {
				renderResolved3P();
				expect(expValEquals).not.toHaveBeenCalledWith(NON_PRIMARY_EXPERIMENT, 'isEnabled', true);
			});

			it('does NOT fire 3P click events on middle or right click', () => {
				const { container } = renderResolved3P();
				const link = container.querySelector('a')!;
				fireAuxClick(link, 1);
				fireEvent.contextMenu(link);
				expect(mockFireEvent).not.toHaveBeenCalled();
			});
		});
	});
});
