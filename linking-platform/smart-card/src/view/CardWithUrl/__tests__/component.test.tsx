import '@atlaskit/link-test-helpers/jest';
import React from 'react';

import { IntlProvider } from 'react-intl';

import { useCrossProductUrlWrapper } from '@atlaskit/analytics-cross-product/useCrossProductUrlWrapper';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import CardClient from '@atlaskit/link-provider/client';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { UnAuthClient } from '@atlaskit/link-test-helpers/smart-card/mocks/clients';
import type { ProductType } from '@atlaskit/linking-common/types';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { fireEvent, render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { getClickUrl } from '../../../state/getClickUrl';
import { useSmartLink } from '../../../state/hooks/useSmartLink';
import { ANALYTICS_CHANNEL } from '../../../utils/analytics/analytics';
import { default as TitleBlock } from '../../FlexibleCard/components/blocks/title-block';
import * as Fire3PWorkflowsClickEventModule from '../../SmartLinkEvents/useFire3PWorkflowsClickEvent';
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
jest.mock('../../SmartLinkEvents/useFire3PWorkflowsClickEvent', () => ({
	useFire3PWorkflowsClickEvent: jest.fn(),
}));
jest.mock('../../../state/getThirdPartyARI', () => ({
	getThirdPartyARI: jest.fn().mockReturnValue('ari:third-party:something/abc'),
}));
jest.mock('../../../state/getFirstPartyIdentifier', () => ({
	getFirstPartyIdentifier: jest.fn().mockReturnValue('test-first-party-id'),
}));
jest.mock('../../../state/getClickUrl', () => ({
	getClickUrl: jest.fn((url: string) => url),
}));
jest.mock('../../../state/hooks/useSmartLink', () => ({
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
}));
jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(() => false),
}));
jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure', () => ({
	expValEqualsNoExposure: jest.fn(() => false),
}));

const createUseSmartLinkResult = (
	details: SmartLinkResponse = createSmartLinkDetails(),
): ReturnType<typeof useSmartLink> => ({
	state: {
		status: 'resolved',
		details,
	},
	actions: {
		authorize: jest.fn(),
		reload: jest.fn(),
		invoke: jest.fn(),
		loadMetadata: jest.fn(),
		register: jest.fn(),
	},
	config: {},
	renderers: undefined,
	error: null,
	isPreviewPanelAvailable: undefined,
	isPreviewRestricted: undefined,
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
				(Fire3PWorkflowsClickEventModule.useFire3PWorkflowsClickEvent as jest.Mock).mockReturnValue(
					mockFireEvent,
				);
			});

			describe('3P Click Events are still fired on different click events', () => {
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
		},
	);

	describe('link click behaviour', () => {
		let openSpy: jest.SpyInstance;
		let wrapUrl: jest.Mock;
		const embedOpenInNewTabExperiment = 'platform_editor_embed_open_in_new_tab';

		const renderInlineCard = ({
			onClick,
			isFirstParty = false,
			shouldMockUseCrossProductUrlWrapper = true,
			appearance = 'inline',
			smartLinkResult,
		}: {
			appearance?: 'inline' | 'block' | 'embed';
			isFirstParty?: boolean;
			onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
			shouldMockUseCrossProductUrlWrapper?: boolean;
			smartLinkResult?: ReturnType<typeof createUseSmartLinkResult>;
		} = {}) => {
			(useSmartLink as jest.Mock).mockReturnValue(
				smartLinkResult ??
					createUseSmartLinkResult(createSmartLinkDetails(isFirstParty || undefined)),
			);
			if (shouldMockUseCrossProductUrlWrapper) {
				// Reset wrapUrl to identity so URL decoration does not affect navigation assertions
				(useCrossProductUrlWrapper as jest.Mock).mockReturnValue((url: string) => url);
			}

			return render(
				<IntlProvider locale="en">
					<SmartCardProvider client={new CardClient()} product="CONFLUENCE">
						<CardWithUrl
							appearance={appearance}
							id="uid"
							url="https://example.com"
							onClick={onClick}
						/>
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

		describe('when gate is on', () => {
			it.each(['inline', 'block'] as const)(
				'does not open %s cards in a new tab for consumer-handled modified clicks',
				(appearance) => {
					mockExpEnabled(embedOpenInNewTabExperiment);
					const onClick = jest.fn();
					const { container } = renderInlineCard({ appearance, onClick });

					fireEvent.click(container.querySelector('a')!, { metaKey: true });

					expect(onClick).toHaveBeenCalled();
					expect(openSpy).not.toHaveBeenCalled();
				},
			);

			it('opens a modified embed title click through the canonical navigation handler', () => {
				mockExpEnabled(embedOpenInNewTabExperiment);
				const onClick = jest.fn();
				const { container } = renderInlineCard({ appearance: 'embed', onClick });

				fireEvent.click(container.querySelector('a')!, { metaKey: true });

				expect(onClick).toHaveBeenCalled();
				expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
				expect(openSpy).toHaveBeenCalledTimes(1);
			});

			it('routes a middle-click on frame chrome through the canonical navigation handler', () => {
				mockExpEnabled(embedOpenInNewTabExperiment);
				const onClick = jest.fn();
				const { container } = renderInlineCard({ appearance: 'embed', onClick });

				fireEvent(
					container.querySelector('[data-testid="embed-card-resolved-view"]')!,
					new MouseEvent('auxclick', { button: 1, bubbles: true, cancelable: true }),
				);

				expect(onClick).toHaveBeenCalled();
				expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
				expect(openSpy).toHaveBeenCalledTimes(1);
			});

			it('opens an embed title double-click in one new tab through the canonical handler', async () => {
				mockExpEnabled(embedOpenInNewTabExperiment);
				const onClick = jest.fn();
				const { container } = renderInlineCard({ appearance: 'embed', onClick });

				await userEvent.dblClick(container.querySelector('a')!);

				expect(onClick).toHaveBeenCalled();
				expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
				expect(openSpy).toHaveBeenCalledTimes(1);
			});

			it('respects consumer preventDefault for an embed title double-click', async () => {
				mockExpEnabled(embedOpenInNewTabExperiment);
				const onClick = jest.fn((event: React.MouseEvent | React.KeyboardEvent) =>
					event.preventDefault(),
				);
				const { container } = renderInlineCard({ appearance: 'embed', onClick });

				await userEvent.dblClick(container.querySelector('a')!);

				expect(onClick).toHaveBeenCalled();
				expect(openSpy).not.toHaveBeenCalled();
			});

			it('does not add a third new-tab opening for a modified double-click', () => {
				mockExpEnabled(embedOpenInNewTabExperiment);
				const onClick = jest.fn();
				const { container } = renderInlineCard({ appearance: 'embed', onClick });
				const title = container.querySelector('a')!;

				fireEvent.click(title, { metaKey: true, detail: 1 });
				fireEvent.click(title, { metaKey: true, detail: 2 });
				fireEvent.doubleClick(title, { metaKey: true, detail: 2 });

				expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
				expect(openSpy).toHaveBeenCalledTimes(2);
			});

			it('does not add an extra navigation for a double-click without a consumer callback', async () => {
				mockExpEnabled(embedOpenInNewTabExperiment);
				const { container } = renderInlineCard({ appearance: 'embed' });

				await userEvent.dblClick(container.querySelector('a')!);

				expect(openSpy).not.toHaveBeenCalledWith('https://example.com', '_blank');
			});

			it('opens an embed header icon double-click in one new tab without a consumer callback', async () => {
				mockExpEnabled(embedOpenInNewTabExperiment);
				const { container } = renderInlineCard({ appearance: 'embed' });
				const headerIcon = container.querySelector('.embed-header > div > div');

				expect(headerIcon).not.toBeNull();
				await userEvent.dblClick(headerIcon!);

				expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
				expect(openSpy).toHaveBeenCalledTimes(1);
			});

			it('does not add a new tab for nested title content without a consumer callback', async () => {
				mockExpEnabled(embedOpenInNewTabExperiment);
				const { container } = renderInlineCard({ appearance: 'embed' });
				const title = container.querySelector('a')!;
				const titleChild = document.createElement('span');
				titleChild.textContent = title.textContent;
				title.replaceChildren(titleChild);

				await userEvent.dblClick(titleChild);

				expect(openSpy).not.toHaveBeenCalledWith('https://example.com', '_blank');
			});

			it('keeps modified clicks on preview-capable embeds on the new-tab path', () => {
				mockExpEnabled(embedOpenInNewTabExperiment);
				const details = {
					...createSmartLinkDetails(),
					data: {
						...createSmartLinkDetails().data,
						'atlassian:ari': 'ari:cloud:confluence::page/123',
					},
				} as SmartLinkResponse;
				const openPreviewPanel = jest.fn();
				const smartLinkResult = {
					...createUseSmartLinkResult(details),
					isPreviewPanelAvailable: jest.fn().mockReturnValue(true),
					openPreviewPanel,
				};
				const onClick = jest.fn();
				const { container } = renderInlineCard({
					appearance: 'embed',
					onClick,
					smartLinkResult,
				});

				fireEvent.click(container.querySelector('a')!, { metaKey: true });

				expect(onClick).toHaveBeenCalled();
				expect(openPreviewPanel).not.toHaveBeenCalled();
				expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
				expect(openSpy).toHaveBeenCalledTimes(1);
			});

			it('gives the preview panel priority for an embed header icon double-click', () => {
				mockExpEnabled(embedOpenInNewTabExperiment);
				const details = {
					...createSmartLinkDetails(),
					data: {
						...createSmartLinkDetails().data,
						'atlassian:ari': 'ari:cloud:confluence::page/123',
					},
				} as SmartLinkResponse;
				const openPreviewPanel = jest.fn();
				const smartLinkResult = {
					...createUseSmartLinkResult(details),
					isPreviewPanelAvailable: jest.fn().mockReturnValue(true),
					openPreviewPanel,
				};
				const { container } = renderInlineCard({ appearance: 'embed', smartLinkResult });
				const headerIcon = container.querySelector('.embed-header > div > div')!;

				fireEvent.doubleClick(headerIcon, { detail: 2 });

				expect(openPreviewPanel).toHaveBeenCalledTimes(1);
				expect(openSpy).not.toHaveBeenCalled();
			});

			it('keeps native context-menu behavior and updates the embed title to its resolved URL', () => {
				mockExpEnabled(embedOpenInNewTabExperiment);
				const { container } = renderInlineCard({
					appearance: 'embed',
					isFirstParty: true,
					shouldMockUseCrossProductUrlWrapper: false,
				});
				const title = container.querySelector('a')!;
				expect(title.href).toBe('https://example.com/');
				const contextMenu = new MouseEvent('contextmenu', {
					bubbles: true,
					cancelable: true,
				});

				fireEvent(title, contextMenu);

				expect(contextMenu.defaultPrevented).toBe(false);
				expect(title.href).toBe('https://example.com/?xpis=wrapped');
			});

			it('preserves keyboard navigation through the embed title link', async () => {
				mockExpEnabled(embedOpenInNewTabExperiment);
				const { getByRole } = renderInlineCard({ appearance: 'embed' });
				getByRole('link', { name: 'Link title' }).focus();

				await userEvent.keyboard('{Enter}');

				expect(openSpy).toHaveBeenCalledWith('https://example.com', '_self');
				expect(openSpy).toHaveBeenCalledTimes(1);
			});

			it('respects consumer preventDefault for a modified embed title click', () => {
				mockExpEnabled(embedOpenInNewTabExperiment);
				const onClick = jest.fn((event: React.MouseEvent | React.KeyboardEvent) =>
					event.preventDefault(),
				);
				const { container } = renderInlineCard({ appearance: 'embed', onClick });

				fireEvent.click(container.querySelector('a')!, { ctrlKey: true });

				expect(onClick).toHaveBeenCalled();
				expect(openSpy).not.toHaveBeenCalled();
			});

			it('keeps embed modifier navigation disabled outside the experiment', () => {
				mockExpDisabled(embedOpenInNewTabExperiment);
				const onClick = jest.fn();
				const { container } = renderInlineCard({ appearance: 'embed', onClick });

				fireEvent.click(container.querySelector('a')!, { metaKey: true });

				expect(onClick).toHaveBeenCalled();
				expect(openSpy).not.toHaveBeenCalled();
			});

			it('keeps embed double-click navigation disabled outside the experiment', async () => {
				mockExpDisabled(embedOpenInNewTabExperiment);
				const onClick = jest.fn();
				const { container } = renderInlineCard({ appearance: 'embed', onClick });

				await userEvent.dblClick(container.querySelector('a')!);

				expect(onClick).toHaveBeenCalled();
				expect(openSpy).not.toHaveBeenCalled();
			});

			it('does not open a header icon double-click when the experiment is disabled', async () => {
				mockExpDisabled(embedOpenInNewTabExperiment);
				const { container } = renderInlineCard({ appearance: 'embed' });
				const headerIcon = container.querySelector('.embed-header > div > div');

				expect(headerIcon).not.toBeNull();
				await userEvent.dblClick(headerIcon!);

				expect(openSpy).not.toHaveBeenCalled();
			});

			it('opens the link in the same tab on a regular left click', () => {
				renderInlineCard();

				fireEvent.click(document.querySelector('a')!);

				expect(openSpy).toHaveBeenCalledWith('https://example.com', '_self');
			});

			it('opens the link in a new tab on modifier+click', () => {
				renderInlineCard();

				fireEvent.click(document.querySelector('a')!, { metaKey: true });

				expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
			});

			it('calls onClick and does not call window.open when onClick is provided', () => {
				const onClick = jest.fn();
				renderInlineCard({ onClick });

				fireEvent.click(document.querySelector('a')!);

				expect(onClick).toHaveBeenCalled();
				expect(openSpy).not.toHaveBeenCalled();
			});

			it('does not open the link when onClick calls preventDefault', () => {
				const onClick = jest.fn((e: React.MouseEvent | React.KeyboardEvent) => e.preventDefault());
				renderInlineCard({ onClick });

				fireEvent.click(document.querySelector('a')!);

				expect(onClick).toHaveBeenCalled();
				expect(openSpy).not.toHaveBeenCalled();
			});

			it('updates anchor href to decorated URL on click when href differs', () => {
				const { container } = renderInlineCard({
					isFirstParty: true,
					shouldMockUseCrossProductUrlWrapper: false,
				});
				const anchor = container.querySelector('a')!;

				expect(anchor.href).toBe('https://example.com/');

				fireEvent.click(anchor);

				expect(anchor.href).toBe('https://example.com/?xpis=wrapped');
			});

			it('does not update anchor href when href already equals decorated URL', () => {
				const { container } = renderInlineCard();
				const anchor = container.querySelector('a')!;
				const hrefBefore = anchor.href;

				fireEvent.click(anchor);

				expect(anchor.href).toBe(hrefBefore);
			});

			it('updates anchor href to decorated URL on middle-click', () => {
				const { container } = renderInlineCard({
					isFirstParty: true,
					shouldMockUseCrossProductUrlWrapper: false,
				});
				const anchor = container.querySelector('a')!;

				expect(anchor.href).toBe('https://example.com/');

				fireEvent(
					anchor,
					new MouseEvent('auxclick', { button: 1, bubbles: true, cancelable: true }),
				);

				expect(anchor.href).toBe('https://example.com/?xpis=wrapped');
			});

			it('updates anchor href to decorated URL on right-click (context menu)', () => {
				const { container } = renderInlineCard({
					isFirstParty: true,
					shouldMockUseCrossProductUrlWrapper: false,
				});
				const anchor = container.querySelector('a')!;

				expect(anchor.href).toBe('https://example.com/');

				fireEvent.contextMenu(anchor);

				expect(anchor.href).toBe('https://example.com/?xpis=wrapped');
			});

			describe('cross-product URL wrapping', () => {
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

				it('wraps resolved first-party Smart Link click URLs when the gate is enabled', () => {
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
					const { container } = renderResolvedLink({
						details: createSmartLinkDetails(false),
					});

					fireEvent.click(container.querySelector('a')!);

					expect(wrapUrl).not.toHaveBeenCalled();
					expect(openSpy).toHaveBeenCalledWith('https://example.com', '_self');
				});
			});
		});
	});
});

describe('embedded Flexible Card destinations', () => {
	const original = 'https://example.com';
	const destination = 'https://example.com/portal/article/123';
	type Navigation = NonNullable<React.ComponentProps<typeof SmartCardProvider>['linkNavigation']>;
	const policy = jest.fn<ReturnType<Navigation>, Parameters<Navigation>>();
	const onEvent = jest.fn();
	let open: jest.SpyInstance;
	beforeEach(() => {
		policy.mockReset().mockReturnValue({ url: destination, target: '_top' });
		onEvent.mockClear();
		jest.mocked(getClickUrl).mockImplementation((url) => url);
		open = jest.spyOn(window, 'open').mockImplementation(() => null);
		(useSmartLink as jest.Mock).mockReturnValue(createUseSmartLinkResult());
		jest.mocked(useCrossProductUrlWrapper).mockReturnValue((url) => url);
	});
	afterEach(() => open.mockRestore());

	const setup = (
		props: Partial<React.ComponentProps<typeof CardWithUrl>> = {},
		enabled = true,
		linkNavigation: Navigation | null = policy,
	) => {
		if (enabled) passGate('confluence_ep_shim_macro_links_v2');
		else failGate('confluence_ep_shim_macro_links_v2');
		const client = new CardClient();
		const renderCard = () => (
			<IntlProvider locale="en">
				<SmartCardProvider
					client={client}
					product="CONFLUENCE"
					linkNavigation={linkNavigation ?? undefined}
				>
					<SmartCardProvider>
						<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
							<CardWithUrl
								appearance="block"
								id="embedded"
								url={original}
								ui={{ clickableContainer: true }}
								children={<TitleBlock />}
								{...props}
							/>
						</AnalyticsListener>
					</SmartCardProvider>
				</SmartCardProvider>
			</IntlProvider>
		);
		const view = render(renderCard());
		return {
			...view,
			links: view.getAllByRole('link'),
			refresh: () => view.rerender(renderCard()),
		};
	};

	it.each([
		['background', 0],
		['title', 1],
	] as const)('uses inherited navigation for the %s link', (_, index) => {
		const onClick = jest.fn();
		const { links } = setup({ onClick });
		expect(links).toHaveLength(2);
		expect(links[index]).toHaveAttribute('href', destination);
		expect(links[index]).toHaveAttribute('target', '_top');
		expect(useSmartLink).toHaveBeenCalledWith('embedded', original, 'block');
		fireEvent.click(links[index]);
		expect(policy).toHaveBeenCalledWith(original);
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick.mock.calls[0][1]).toEqual({ url: original, destinationUrl: destination });
		expect(open).toHaveBeenCalledTimes(1);
		expect(open).toHaveBeenCalledWith(destination, '_top');
		expect(
			onEvent.mock.calls.filter(
				([event]) => event.payload.action === 'clicked' && event.payload.actionSubject === 'link',
			),
		).toHaveLength(1);
	});

	it.each(['gate disabled', 'no callback', 'inline', 'block'] as const)(
		'keeps existing behavior: %s',
		(mode) => {
			const props =
				mode === 'inline' || mode === 'block'
					? { appearance: mode, ui: undefined, children: undefined }
					: {};
			const { links } = setup(
				props,
				mode !== 'gate disabled',
				mode === 'no callback' ? null : policy,
			);
			links.forEach((link) => expect(link).toHaveAttribute('href', original));
			fireEvent.click(links[0]);
			expect(open).toHaveBeenCalledWith(original, '_self');
			expect(policy).not.toHaveBeenCalled();
		},
	);

	it.each(['_blank', '_self', '_top', '_parent'] as const)(
		'preserves the explicit target %s',
		(target) => {
			const { links } = setup({ children: <TitleBlock anchorTarget={target} /> });
			links.forEach((link) => expect(link.getAttribute('target') || '_self').toBe(target));
			fireEvent.click(links[0]);
			expect(open).toHaveBeenCalledWith(destination, target);
		},
	);

	describe('when running inside an iframe', () => {
		let topSpy: jest.SpyInstance;

		beforeEach(() => {
			topSpy = jest.spyOn(window, 'top', 'get').mockReturnValue(null);
		});

		afterEach(() => {
			topSpy.mockRestore();
		});

		it('overrides the navigation policy target', () => {
			const { links } = setup();
			fireEvent.click(links[0]);

			expect(open).toHaveBeenCalledWith(destination, '_blank');
		});
	});

	it('uses the anchor destination and frame target supplied by the policy', () => {
		policy.mockReturnValue({ url: '#heading', target: '_self' });
		const { links } = setup();
		links.forEach((link) => expect(link).toHaveAttribute('href', '#heading'));
		fireEvent.click(links[0]);
		expect(open).toHaveBeenCalledWith('#heading', '_self');
	});

	it('supports accessible keyboard activation and focus for both links', async () => {
		const user = userEvent.setup();
		const { container, links } = setup();
		await expect(container).toBeAccessible();
		for (const link of links) {
			await user.tab();
			expect(link).toHaveFocus();
			await user.keyboard('{Enter}');
			expect(open).toHaveBeenLastCalledWith(destination, '_top');
			expect(link).toHaveFocus();
		}
		expect(open).toHaveBeenCalledTimes(2);
		await user.tab({ shift: true });
		expect(links[0]).toHaveFocus();
	});

	it.each([0, 1])('honors cancellation for link %s', (index) => {
		const { links } = setup({ onClick: (event) => event.preventDefault() });
		fireEvent.click(links[index]);
		expect(open).not.toHaveBeenCalled();
	});

	it.each([{ metaKey: true }, { ctrlKey: true }, { shiftKey: true }])(
		'preserves modified clicks: %j',
		(keys) => {
			const { links } = setup();
			fireEvent.click(links[0], keys);
			expect(open).toHaveBeenCalledTimes(1);
			expect(open).toHaveBeenCalledWith(destination, '_blank');
		},
	);

	it.each(['auxclick', 'contextmenu'])('refreshes the native destination on %s', (type) => {
		const { links } = setup();
		const updated = `${destination}?updated`;
		policy.mockReturnValue({ url: updated, target: '_top' });
		fireEvent(
			links[0],
			new MouseEvent(type, { button: type === 'auxclick' ? 1 : 2, bubbles: true }),
		);
		expect(links[0]).toHaveAttribute('href', updated);
		expect(open).not.toHaveBeenCalled();
	});

	it('updates destinations when pending metadata resolves and changes again', () => {
		const initial = createUseSmartLinkResult();
		initial.state.status = 'pending';
		(useSmartLink as jest.Mock).mockReturnValue(initial);
		jest.mocked(useCrossProductUrlWrapper).mockReturnValue((url) => `${url}?tracking=retained`);
		policy.mockImplementation((url) => ({
			url: url.replace('example.com', 'portal.example.com'),
			target: '_top',
		}));
		const { getAllByRole, refresh } = setup();
		expect(getAllByRole('link')[0]).toHaveAttribute('href', 'https://portal.example.com');
		for (const suffix of ['/resolved', '/updated']) {
			(useSmartLink as jest.Mock).mockReturnValue(
				createUseSmartLinkResult(createSmartLinkDetails(true)),
			);
			jest.mocked(getClickUrl).mockReturnValue(original + suffix);
			refresh();
			const expected = `https://portal.example.com${suffix}?tracking=retained`;
			getAllByRole('link').forEach((link) => expect(link).toHaveAttribute('href', expected));
			fireEvent.click(getAllByRole('link')[0]);
			expect(open).toHaveBeenLastCalledWith(expected, '_top');
		}
	});
});
