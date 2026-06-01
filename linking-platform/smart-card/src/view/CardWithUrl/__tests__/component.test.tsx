import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { IntlProvider } from 'react-intl';

import { useCrossProductUrlWrapper } from '@atlaskit/analytics-cross-product/useCrossProductUrlWrapper';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { UnAuthClient } from '@atlaskit/link-test-helpers';
import { type ProductType } from '@atlaskit/linking-common';
import { type SmartLinkResponse } from '@atlaskit/linking-types';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { fireEvent, render } from '@atlassian/testing-library';

import { useSmartLink } from '../../../state';
import { ANALYTICS_CHANNEL } from '../../../utils/analytics';
import { TitleBlock } from '../../FlexibleCard/components/blocks';
import * as SmartLinkEventsModule from '../../SmartLinkEvents/useSmartLinkEvents';
import { CardWithUrl } from '../component';

type SmartLinkMetaWithFirstPartySignal = SmartLinkResponse['meta'] & {
	is1PLink?: boolean;
};

const createSmartLinkDetails = (isFirstPartyLink?: boolean): SmartLinkResponse => ({
	meta: {
		access: 'granted',
		visibility: 'public',
		definitionId: 'test-definition-id',
		...(isFirstPartyLink === undefined ? {} : { is1PLink: isFirstPartyLink }),
	} as SmartLinkMetaWithFirstPartySignal,
	data: {
		'@type': 'Document',
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		name: 'Link title',
		url: 'https://example.com',
		// `preview` needs to be defined for embed link to not fall back to BlockCard
		// (the `if (resolvedViewProps.preview)` branch in EmbedCard/index.tsx).
		preview: { content: 'embed-content' } as JsonLd.Data.BaseData['preview'],
	},
});

jest.mock('@atlaskit/analytics-cross-product/useCrossProductUrlWrapper', () => ({
	useCrossProductUrlWrapper: jest.fn(() => (url: string) => url),
}));
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
			details: {
				meta: {
					access: 'granted',
					visibility: 'public',
					definitionId: 'test-definition-id',
				},
				data: {
					'@type': 'Document',
					'@context': {
						'@vocab': 'https://www.w3.org/ns/activitystreams#',
					},
					name: 'Link title',
					url: 'https://example.com',
					// `preview.content` needs to be defined for embed link to not fall back to BlockCard
					// (the `if (resolvedViewProps.preview)` branch in EmbedCard/index.tsx).
					preview: { content: 'embed-content' },
				},
			},
		},
		actions: { authorize: jest.fn(), reload: jest.fn(), invoke: jest.fn() },
		config: {},
		renderers: undefined,
		error: undefined,
		isPreviewPanelAvailable: undefined,
		openPreviewPanel: undefined,
	})),
	useSmartLinkContext: jest.fn(() => ({
		connections: { client: { baseUrlOverride: undefined } },
	})),
}));
jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(() => false),
}));
jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure', () => ({
	expValEqualsNoExposure: jest.fn(() => false),
}));

const createUseSmartLinkResult = (details: SmartLinkResponse = createSmartLinkDetails()) => ({
	state: {
		status: 'resolved',
		details,
	},
	actions: { authorize: jest.fn(), reload: jest.fn(), invoke: jest.fn() },
	config: {},
	renderers: undefined,
	error: undefined,
	isPreviewPanelAvailable: undefined,
	openPreviewPanel: undefined,
});

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
		(useCrossProductUrlWrapper as jest.Mock).mockReturnValue((url: string) => url);
		(useSmartLink as jest.Mock).mockImplementation(() => createUseSmartLinkResult());
	});

	it('should capture and report a11y violations', async () => {
		const { container, unmount } = setup();
		await expect(container).toBeAccessible();
		unmount();
	});

	// Card variants that support middle / right click 3P telemetry.
	const variantsThatSupportNonPrimaryClicks = ['inline', 'block', 'embed', 'flexible'] as const;

	describe.each(variantsThatSupportNonPrimaryClicks)(
		'middle / right clicks on %s card',
		(appearance) => {
			let mockFireEvent: jest.Mock;

			const NON_PRIMARY_EXPERIMENT = 'linking_platform_track_non_primary_3p_clicks';
			const SMARTLINK_3P_ANALYTICS_FF = 'platform_smartlink_3pclick_analytics';

			const renderResolved3P = () =>
				render(
					<IntlProvider locale="en">
						<SmartCardProvider client={new CardClient()}>
							{appearance === 'flexible' ? (
								// FlexCard is detected via the presence of a TitleBlock child (see isFlexibleUiCard).
								// The outer `appearance` is ignored once FlexCard takes over rendering.
								<CardWithUrl appearance="block" id="uid" url="https://example.com">
									<TitleBlock />
								</CardWithUrl>
							) : (
								<CardWithUrl
									appearance={appearance as 'inline' | 'block' | 'embed'}
									id="uid"
									url="https://example.com"
								/>
							)}
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
		},
	);

	describe('cross-product URL wrapping', () => {
		const SMARTLINK_XPC_FF = 'platform_smartlink_xpc_url_wrapping';

		let openSpy: jest.SpyInstance;
		let wrapUrl: jest.Mock;

		const renderResolvedLink = ({
			appearance = 'inline',
			details,
			product = 'CONFLUENCE',
			url = 'https://example.com',
		}: {
			appearance?: 'inline' | 'block' | 'embed' | 'flexible';
			details: SmartLinkResponse;
			product?: ProductType;
			url?: string;
		}) => {
			(useSmartLink as jest.Mock).mockReturnValue(createUseSmartLinkResult(details));

			return render(
				<IntlProvider locale="en">
					<SmartCardProvider client={new CardClient()} product={product}>
						{appearance === 'flexible' ? (
							<CardWithUrl appearance="block" id="uid" url={url}>
								<TitleBlock />
							</CardWithUrl>
						) : (
							<CardWithUrl appearance={appearance} id="uid" url={url} />
						)}
					</SmartCardProvider>
				</IntlProvider>,
			);
		};

		beforeEach(() => {
			openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
			wrapUrl = jest.fn((url: string) => `${url}?xpis=wrapped`);
			(useCrossProductUrlWrapper as jest.Mock).mockReturnValue(wrapUrl);
		});

		afterEach(() => {
			openSpy.mockRestore();
		});

		it('wraps resolved first-party Smart Link click URLs when the gate is enabled', () => {
			passGate(SMARTLINK_XPC_FF);

			const { container } = renderResolvedLink({
				details: createSmartLinkDetails(true),
			});

			fireEvent.click(container.querySelector('a')!);

			expect(useCrossProductUrlWrapper).toHaveBeenCalledWith({
				bridge: 'smartLinks',
				product: 'confluence',
			});
			expect(wrapUrl).toHaveBeenCalledWith('https://example.com');
			expect(openSpy).toHaveBeenCalledWith('https://example.com?xpis=wrapped', '_self');
		});

		it('does not wrap third-party Smart Link click URLs', () => {
			passGate(SMARTLINK_XPC_FF);

			const { container } = renderResolvedLink({
				details: createSmartLinkDetails(false),
			});

			fireEvent.click(container.querySelector('a')!);

			expect(wrapUrl).not.toHaveBeenCalled();
			expect(openSpy).toHaveBeenCalledWith('https://example.com', '_self');
		});

		it('does not wrap when the SmartLinks integration gate is disabled', () => {
			failGate(SMARTLINK_XPC_FF);

			const { container } = renderResolvedLink({
				details: createSmartLinkDetails(true),
			});

			fireEvent.click(container.querySelector('a')!);

			expect(useCrossProductUrlWrapper).not.toHaveBeenCalled();
			expect(wrapUrl).not.toHaveBeenCalled();
			expect(openSpy).toHaveBeenCalledWith('https://example.com', '_self');
		});

		it('does not double wrap URLs that already include cross-product interaction params', () => {
			passGate(SMARTLINK_XPC_FF);

			const { container } = renderResolvedLink({
				details: createSmartLinkDetails(true),
				url: 'https://example.com?xpis=existing',
			});

			fireEvent.click(container.querySelector('a')!);

			expect(wrapUrl).not.toHaveBeenCalled();
			expect(openSpy).toHaveBeenCalledWith('https://example.com?xpis=existing', '_self');
		});
	});
});
