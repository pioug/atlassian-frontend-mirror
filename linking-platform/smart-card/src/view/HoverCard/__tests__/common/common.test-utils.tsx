import * as analytics from '../../../../utils/analytics/analytics';
import { act, fireEvent } from '@testing-library/react';
import { PROVIDER_KEYS_WITH_THEMING } from '../../../../extractors/constants';
import {
	mockBaseResponseWithErrorPreview,
	mockConfluenceResponse,
	mockJiraResponse,
	mockUnauthorisedResponse,
} from '../__mocks__/mocks';
import { mocks } from '../../../../utils/mocks';
import { within } from '@testing-library/dom';
import { type setup as hoverCardSetup, type SetUpParams } from './setup.test-utils';
import { additionalPayloadAttributes, getEventPayload } from './analytics.test-utils';
import { CardAction, type CardActionOptions } from '../../../../view/Card/types';

const userEventOptionsWithAdvanceTimers = {
	advanceTimers: jest.advanceTimersByTime,
};

export const mockUrl = 'https://some.url';

type TestConfig = {
	testIds: {
		unauthorizedTestId: string;
		erroredTestId?: string;
		secondaryChildTestId: string;
	};
};

export const forbiddenViewTests = (
	setup: (params?: SetUpParams) => ReturnType<typeof hoverCardSetup>,
) => {
	describe('renders forbidden view hover card', () => {
		it('when response is forbidden', async () => {
			const { findByTestId } = await setup({
				mock: mocks.forbidden,
				testId: 'hover-card-trigger-wrapper',
			});
			const hoverCard = await findByTestId('hover-card');
			expect(hoverCard).toBeTruthy();
		});

		it('when response is not_found with access_exists', async () => {
			const mock = mocks.notFound;
			mock.meta.requestAccess = {
				accessType: 'ACCESS_EXISTS',
			};
			const { findByTestId } = await setup({
				mock: mock,
				testId: 'hover-card-trigger-wrapper',
			});
			const hoverCard = await findByTestId('hover-card');
			expect(hoverCard).toBeTruthy();
		});
	});
};

export const unauthorizedViewTests = (
	setup: (params?: SetUpParams) => ReturnType<typeof hoverCardSetup>,
	config: TestConfig,
) => {
	describe('Unauthorized Hover Card', () => {
		const authTooltipId = 'hover-card-unauthorised-view';
		const {
			testIds: { unauthorizedTestId },
		} = config;

		it('shows Unauthorised hover card when the "showAuthTooltip" is true', async () => {
			const { findByTestId } = await setup({
				mock: mockUnauthorisedResponse,
				testId: unauthorizedTestId,
			});

			const unauthorisedHoverCard = await findByTestId(authTooltipId);

			expect(unauthorisedHoverCard).toBeTruthy();
		});

		it('does not render a hover card for unauthorised card when "showAuthTooltip" is false', async () => {
			const mockFetch = jest.fn(() => Promise.resolve(mockUnauthorisedResponse));
			const { queryByTestId } = await setup({
				extraCardProps: { showAuthTooltip: false },
				mockFetch,
				testId: unauthorizedTestId,
			});

			expect(queryByTestId('hover-card-trigger-wrapper')).toBeNull();
		});

		it('renders the correct view of unauthorised hover card', async () => {
			const { findByTestId } = await setup({
				mock: mockUnauthorisedResponse,
				testId: unauthorizedTestId,
			});

			const hoverCard = await findByTestId(authTooltipId);

			for (const [testId, expectToBeInTheDocument] of [
				['hover-card-unauthorised-view-title', true],
				['smart-element-icon', true],
				['hover-card-unauthorised-view-content', true],
				['hover-card-unauthorised-view-button', true],
				['smart-action-edit-action', false],
				['action-group-more-button', false],
			] as [string, boolean][]) {
				if (expectToBeInTheDocument) {
					expect(within(hoverCard).getByTestId(testId)).toBeInTheDocument();
				} else {
					expect(within(hoverCard).queryByTestId(testId)).not.toBeInTheDocument();
				}
			}
		});

		it('does not render auth tooltip when the auth flow is not present in the response', async () => {
			const { queryByTestId } = await setup({
				extraCardProps: { showAuthTooltip: true },
				mock: {
					...mockUnauthorisedResponse,
					meta: {
						...mockUnauthorisedResponse.meta,
						auth: [],
					},
				},
				testId: unauthorizedTestId,
			});
			expect(queryByTestId(authTooltipId)).toBeNull();
		});

		// TODO: Move the analytics test to analytics.test-utils.ts when EDM-7412 is completed
		it('should fire viewed event when hover card is opened', async () => {
			const mock = jest.spyOn(analytics, 'uiHoverCardViewedEvent');

			const { findByTestId } = await setup({
				mock: mockUnauthorisedResponse,
				testId: 'hover-card-trigger-wrapper',
			});

			//wait for card to be resolved
			await findByTestId(authTooltipId);
			expect(analytics.uiHoverCardViewedEvent).toHaveBeenCalledTimes(1);
			expect(mock.mock.results[0].value).toEqual(
				getEventPayload({
					action: 'viewed',
					actionSubject: 'hoverCard',
					additionalAttributes: {
						...additionalPayloadAttributes,
						extensionKey: 'google-object-provider',
						status: 'unauthorized',
						definitionId: '440fdd47-25ac-4ac2-851f-1b7526365ade',
						destinationObjectType: 'file',
						resourceType: 'file',
					},
				}),
			);
		});

		// TODO: Move the analytics test to analytics.test-utils.ts when EDM-7412 is completed
		it('should fire dismissed event when hover card is opened then closed', async () => {
			const mock = jest.spyOn(analytics, 'uiHoverCardDismissedEvent');

			const { queryByTestId, findByTestId, element, event } = await setup({
				mock: mockUnauthorisedResponse,
				testId: 'hover-card-trigger-wrapper',
			});
			// wait for card to be resolved
			await findByTestId(authTooltipId);
			await event.unhover(element);
			act(() => {
				jest.runAllTimers();
			});
			expect(queryByTestId('hover-card')).not.toBeInTheDocument();
			expect(analytics.uiHoverCardDismissedEvent).toHaveBeenCalledTimes(1);

			expect(mock.mock.results[0].value).toEqual(
				getEventPayload({
					action: 'dismissed',
					actionSubject: 'hoverCard',
					additionalAttributes: {
						...additionalPayloadAttributes,
						extensionKey: 'google-object-provider',
						hoverTime: 0,
						status: 'unauthorized',
						definitionId: '440fdd47-25ac-4ac2-851f-1b7526365ade',
						destinationObjectType: 'file',
						resourceType: 'file',
					},
				}),
			);
		});
	});
};

export const runCommonHoverCardTests = (
	setup: (params?: SetUpParams) => ReturnType<typeof hoverCardSetup>,
	config: TestConfig,
) => {
	it('should show tooltip on copy link button', async () => {
		const { findByTestId, event, findByRole, queryByRole } = await setup();

		const content = await findByTestId('smart-block-title-resolved-view');
		const copyButton = await findByTestId('smart-action-copy-link-action');
		expect(queryByRole('tooltip')).toBeNull();
		await event.hover(copyButton);
		const tooltip = await findByRole('tooltip');

		expect(content).toBeTruthy();
		expect(tooltip.textContent).toBe('Copy link');
	});

	describe('show-hide behaviour', () => {
		const {
			testIds: { secondaryChildTestId },
		} = config;

		it('renders hover card', async () => {
			const { findByTestId } = await setup();
			act(() => {
				jest.runAllTimers();
			});
			expect(await findByTestId('hover-card')).toBeInTheDocument();
		});

		it('should wait a default delay before showing', async () => {
			const { queryByTestId, findByTestId } = await setup({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			act(() => {
				jest.advanceTimersByTime(499); // Delay not completed yet
			});
			expect(queryByTestId('hover-card')).not.toBeInTheDocument();
			act(() => {
				jest.advanceTimersByTime(1); // Delay completed
			});

			expect(await findByTestId('hover-card')).toBeInTheDocument();
		});

		it('should wait a custom delay before showing if provided', async () => {
			const { queryByTestId, findByTestId } = await setup({
				userEventOptions: userEventOptionsWithAdvanceTimers,
				extraCardProps: { hoverPreviewOptions: { fadeInDelay: 1000 } },
			});

			act(() => {
				jest.advanceTimersByTime(999); // Delay not completed yet
			});
			expect(queryByTestId('hover-card')).not.toBeInTheDocument();
			act(() => {
				jest.advanceTimersByTime(1); // Delay completed
			});

			expect(await findByTestId('hover-card')).toBeInTheDocument();
		});

		it('should wait a default delay before hiding', async () => {
			const { queryByTestId, element, event } = await setup({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});
			act(() => {
				jest.runAllTimers();
			});
			await event.unhover(element);
			act(() => {
				jest.advanceTimersByTime(299); // Delay not completed yet
			});

			expect(queryByTestId('hover-card')).toBeInTheDocument();

			act(() => {
				jest.advanceTimersByTime(1); // Delay completed
			});

			expect(queryByTestId('hover-card')).not.toBeInTheDocument();
		});

		it('should stay shown if theres a mouseEnter before the delay elapses', async () => {
			const { queryByTestId, element, event } = await setup({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			act(() => {
				jest.runAllTimers();
			});
			await event.unhover(element);
			act(() => {
				jest.advanceTimersByTime(299); // Delay not completed yet
			});

			expect(queryByTestId('hover-card')).toBeInTheDocument();

			await event.hover(element);
			act(() => {
				jest.advanceTimersByTime(1); // Delay completed
			});

			expect(queryByTestId('hover-card')).toBeInTheDocument();
		});

		it('should stay hidden if there is a mouseLeave before the delay elapses', async () => {
			const { queryByTestId, element, event } = await setup({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			act(() => {
				jest.advanceTimersByTime(299); // Delay not completed yet
			});

			expect(queryByTestId('hover-card')).not.toBeInTheDocument();
			await event.unhover(element);
			await act(async () => {
				jest.advanceTimersByTime(1); // Delay completed
			});

			expect(queryByTestId('hover-card')).not.toBeInTheDocument();
		});

		it('should stay shown if mouse moves over the hover card', async () => {
			const { findByTestId, queryByTestId, event } = await setup();

			const hoverCard = await findByTestId('hover-card');
			await event.hover(hoverCard);

			expect(queryByTestId('hover-card')).toBeInTheDocument();
		});

		it('should hide if mouse moves on the hover card and then leaves it', async () => {
			const { findByTestId, queryByTestId, event } = await setup();

			const hoverCard = await findByTestId('hover-card');
			await event.hover(hoverCard);

			await event.unhover(hoverCard);
			act(() => {
				jest.runAllTimers();
			});

			expect(queryByTestId('hover-card')).not.toBeInTheDocument();
		});

		it('should hide the card if a mouse sends multiple mouse over events but leaves the hover area before the delay elapses', async () => {
			const { queryByTestId, findAllByTestId, element, event } = await setup({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			act(() => {
				jest.advanceTimersByTime(100);
			});
			const titleAndIcon = await findAllByTestId(secondaryChildTestId);
			await event.hover(titleAndIcon[0]);
			act(() => {
				jest.advanceTimersByTime(199);
			});

			expect(queryByTestId('hover-card')).not.toBeInTheDocument();

			await event.unhover(element);
			act(() => {
				jest.advanceTimersByTime(1);
			});

			expect(queryByTestId('hover-card')).not.toBeInTheDocument();
		});

		it('should show the card in 500ms the card if a mouse sends multiple mouse over events over children', async () => {
			const { queryByTestId, findAllByTestId } = await setup({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			act(() => {
				jest.advanceTimersByTime(300);
			});

			const titleAndIcon = await findAllByTestId(secondaryChildTestId);

			fireEvent.mouseOver(titleAndIcon[0]);
			fireEvent(
				titleAndIcon[0],
				new MouseEvent('mouseleave', {
					bubbles: false,
					cancelable: true,
				}),
			);

			act(() => {
				jest.advanceTimersByTime(100);
			});

			fireEvent.mouseOver(titleAndIcon[0]);
			fireEvent(
				titleAndIcon[0],
				new MouseEvent('mouseleave', {
					bubbles: false,
					cancelable: true,
				}),
			);

			act(() => {
				jest.advanceTimersByTime(100);
			});

			expect(queryByTestId('hover-card')).toBeInTheDocument();
		});

		it('should hide after pressing escape', async () => {
			const { queryByTestId, event } = await setup();
			await act(async () => {
				await event.keyboard('{Escape}'); // This causes an act error
			});
			expect(queryByTestId('hover-card')).not.toBeInTheDocument();
		});

		it('should close hover card when a user right clicks on child', async () => {
			const { element, findByTestId, queryByTestId, event } = await setup();

			expect(await findByTestId('hover-card')).toBeInTheDocument();
			await event.pointer({ keys: '[MouseRight>]', target: element });

			expect(queryByTestId('hover-card')).not.toBeInTheDocument();
		});
	});

	it('renders hover card redesign', async () => {
		const { findByTestId } = await setup();
		const actionBlock = await findByTestId('smart-block-action');
		expect(actionBlock).toBeInTheDocument();
	});

	describe('client-side actions', () => {
		it('should render smartlink actions', async () => {
			const { findByTestId } = await setup();
			const downloadButton = await findByTestId('smart-action-download-action');
			const previewButton = await findByTestId('smart-action-preview-action');

			expect(downloadButton.textContent).toBe('Download file');
			expect(previewButton.textContent).toBe('Open preview');
		});

		it('should not render smartlinks actions if disabled', async () => {
			const { queryByTestId } = await setup();

			expect(queryByTestId('smart-action-download-action')).not.toBeInTheDocument();
			expect(queryByTestId('smart-action-preview-action')).not.toBeInTheDocument();
		});

		it('should not render client actions that are excluded', async () => {
			const { queryByTestId } = await setup({
				extraCardProps: {
					actionOptions: { hide: false, exclude: [CardAction.DownloadAction] },
				},
			});

			expect(queryByTestId('smart-action-download-action')).not.toBeInTheDocument();
			expect(queryByTestId('smart-action-preview-action')).toBeDefined();
		});

		it('should open preview modal after clicking preview button', async () => {
			const { findByTestId, queryByTestId, event } = await setup();

			const previewButton = await findByTestId('smart-action-preview-action');
			await event.click(previewButton);
			const previewModal = await findByTestId('smart-embed-preview-modal');
			expect(previewModal).toBeInTheDocument();

			await findByTestId('block-card-icon');

			const hoverCard = queryByTestId('hover-card');
			expect(hoverCard).not.toBeInTheDocument();
		});

		it('renders copy link action', async () => {
			const { findByTestId } = await setup();
			const hoverCard = await findByTestId('hover-card');
			const block = await within(hoverCard).findByTestId('smart-block-action');
			const button = await within(block).findByTestId('smart-action-copy-link-action');
			expect(button).toBeInTheDocument();
		});

		describe('FF fix embed preview url query params', () => {
			it.each([...PROVIDER_KEYS_WITH_THEMING, 'not-supported-provider'])(
				'should add themeState query param if theming is supported',
				async (providerKey) => {
					const expectedPreviewUrl = 'http://some-preview-url-test.com';

					let mock = {
						...mockConfluenceResponse,
						meta: { ...mockConfluenceResponse.meta, key: providerKey },
						data: {
							...mockConfluenceResponse.data,
							preview: {
								'@type': 'Link',
								href: expectedPreviewUrl,
							},
						},
					};

					const { findByTestId, event } = await setup({
						mock,
						extraCardProps: { url: 'http://some-preview-url-test.com' },
					});

					const previewButton = await findByTestId('smart-action-preview-action');
					await event.click(previewButton);
					const iframeEl = await findByTestId(`smart-embed-preview-modal-embed`);
					expect(iframeEl).toBeTruthy();

					if (providerKey !== 'not-supported-provider') {
						expect(iframeEl.getAttribute('src')).toEqual(
							`${expectedPreviewUrl}/?themeState=dark%3Adark+light%3Alight+spacing%3Aspacing+colorMode%3Adark`,
						);
					} else {
						expect(iframeEl.getAttribute('src')).toEqual(expectedPreviewUrl);
					}
				},
			);
		});
	});

	describe('server-side actions', () => {
		const elementId = 'state-metadata-element--trigger';
		const mock = mockJiraResponse;

		const getCardProps = (showServerActions?: boolean, actionOptions?: CardActionOptions) => ({
			extraCardProps: {
				showServerActions,
				actionOptions,
			},
			mock,
		});

		it('shows server actions when enabled', async () => {
			const { findByTestId } = await setup(getCardProps(true));

			const actionElement = await findByTestId(elementId);
			expect(actionElement).toBeInTheDocument();
		});

		it('does not show server actions when disable', async () => {
			const { queryByTestId } = await setup(getCardProps(false));

			const actionElement = queryByTestId(elementId);

			expect(actionElement).not.toBeInTheDocument();
		});

		it('shows server action when option not provided', async () => {
			const { findByTestId } = await setup(getCardProps());

			const actionElement = await findByTestId(elementId);
			expect(actionElement).toBeInTheDocument();
		});

		it('shows server actions when actionOptions is provided and hide is false', async () => {
			const { findByTestId } = await setup(getCardProps(undefined, { hide: false }));

			const actionElement = await findByTestId(elementId);
			expect(actionElement).toBeInTheDocument();
		});

		it('hides excluded server actions when actionOptions.excluded is provided', async () => {
			const { queryByTestId } = await setup(
				getCardProps(undefined, {
					hide: false,
					exclude: [CardAction.ChangeStatusAction],
				}),
			);

			const actionElement = queryByTestId(elementId);

			expect(actionElement).not.toBeInTheDocument();
		});

		it('does not show server actions when actionOptions is provided and hide is true', async () => {
			const { queryByTestId } = await setup(getCardProps(undefined, { hide: true }));

			const actionElement = queryByTestId(elementId);

			expect(actionElement).not.toBeInTheDocument();
		});

		it('fires the buttonClicked event on a click of the status lozenge', async () => {
			const { findByTestId, analyticsSpy, event } = await setup(getCardProps(true));

			const actionElement = await findByTestId(elementId);
			expect(actionElement).toBeInTheDocument();
			await act(async () => {
				await event.click(actionElement); // This causes an act error
			});
			expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'clicked',
						actionSubject: 'button',
						actionSubjectId: 'smartLinkStatusLozenge',
					},
				},
				analytics.ANALYTICS_CHANNEL,
			);
		});
	});

	describe('errored links', () => {
		it('should not show a hover card for an errored link', async () => {
			const {
				testIds: { erroredTestId },
			} = config;
			const mockFetch = jest.fn(() =>
				Promise.reject({
					error: {
						type: 'ResolveUnsupportedError',
						message: 'URL not supported',
						status: 404,
					},
					status: 404,
				}),
			);
			const { findByTestId } = await setup({
				mock: mockBaseResponseWithErrorPreview,
				mockFetch: mockFetch,
				testId: erroredTestId,
			});
			await expect(() => findByTestId('hover-card-loading-view')).rejects.toThrow();
		});
	});
};
