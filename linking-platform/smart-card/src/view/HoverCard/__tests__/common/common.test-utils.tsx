import { act, fireEvent, screen, within } from '@testing-library/react';

import { PROVIDER_KEYS_WITH_THEMING } from '../../../../extractors/constants';
import * as analytics from '../../../../utils/analytics/analytics';
import { mocks } from '../../../../utils/mocks';
import { CardAction, type CardActionOptions } from '../../../../view/Card/types';
import {
	mockBaseResponseWithErrorPreview,
	mockConfluenceResponse,
	mockJiraResponse,
	mockUnauthorisedResponse,
} from '../__mocks__/mocks';

import { type setup as hoverCardSetup, type SetUpParams } from './setup.test-utils';

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
			await setup({
				mock: mocks.forbidden,
				testId: 'hover-card-trigger-wrapper',
			});
			const hoverCard = await screen.findByTestId('hover-card');
			expect(hoverCard).toBeTruthy();
		});

		it('when response is not_found with access_exists', async () => {
			const mock = mocks.notFound;
			mock.meta.requestAccess = {
				accessType: 'ACCESS_EXISTS',
			};
			await setup({
				mock: mock,
				testId: 'hover-card-trigger-wrapper',
			});
			const hoverCard = await screen.findByTestId('hover-card');
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

		it('shows Unauthorised hover card when "showHoverPreview" is true', async () => {
			await setup({
				extraCardProps: { showHoverPreview: true },
				mock: mockUnauthorisedResponse,
				testId: unauthorizedTestId,
			});

			const unauthorisedHoverCard = await screen.findByTestId(authTooltipId);
			expect(unauthorisedHoverCard).toBeTruthy();
		});

		it('does not render a hover card when "showHoverPreview" is false', async () => {
			const mockFetch = jest.fn(() => Promise.resolve(mockUnauthorisedResponse));
			await setup({
				extraCardProps: { showHoverPreview: false },
				mockFetch,
				testId: unauthorizedTestId,
			});
			expect(screen.queryByTestId('hover-card-trigger-wrapper')).toBeNull();
			expect(screen.queryByTestId('hover-card-unauthorised-view')).toBeNull();
		});

		it('renders the correct view of unauthorised hover card', async () => {
			await setup({
				mock: mockUnauthorisedResponse,
				testId: unauthorizedTestId,
			});

			const hoverCard = await screen.findByTestId(authTooltipId);

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
			await setup({
				extraCardProps: { showHoverPreview: true },
				mock: {
					...mockUnauthorisedResponse,
					meta: {
						...mockUnauthorisedResponse.meta,
						auth: [],
					},
				},
				testId: unauthorizedTestId,
			});
			expect(screen.queryByTestId(authTooltipId)).toBeNull();
		});

		it('should fire viewed event when hover card is opened', async () => {
			const { mockAnalyticsClient } = await setup({
				mock: mockUnauthorisedResponse,
				testId: 'hover-card-trigger-wrapper',
			});

			// wait for card to be resolved
			await screen.findByTestId(authTooltipId);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'viewed',
					actionSubject: 'hoverCard',
					attributes: expect.objectContaining({
						previewDisplay: 'card',
						previewInvokeMethod: 'mouse_hover',
						extensionKey: 'google-object-provider',
						status: 'unauthorized',
						definitionId: '440fdd47-25ac-4ac2-851f-1b7526365ade',
						destinationObjectType: 'file',
					}),
				}),
			);
		});

		it('should fire dismissed event when hover card is opened then closed', async () => {
			const { element, event, mockAnalyticsClient } = await setup({
				mock: mockUnauthorisedResponse,
				testId: 'hover-card-trigger-wrapper',
			});
			// wait for card to be resolved
			await screen.findByTestId(authTooltipId);
			await event.unhover(element);
			act(() => {
				jest.runAllTimers();
			});
			expect(screen.queryByTestId('hover-card')).not.toBeInTheDocument();
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'dismissed',
					actionSubject: 'hoverCard',
					attributes: expect.objectContaining({
						previewDisplay: 'card',
						previewInvokeMethod: 'mouse_hover',
						extensionKey: 'google-object-provider',
						hoverTime: 0,
						status: 'unauthorized',
						definitionId: '440fdd47-25ac-4ac2-851f-1b7526365ade',
						destinationObjectType: 'file',
					}),
				}),
			);
		});
	});
};

export const runCommonHoverCardTests = (
	setup: (params?: SetUpParams) => ReturnType<typeof hoverCardSetup>,
	config: TestConfig,
) => {
	it('should be accessible', async () => {
		const { container } = await setup();
		await act(async () => {
			jest.runAllTimers();
		});
		expect(await screen.findByTestId('hover-card')).toBeInTheDocument();

		jest.useRealTimers();
		await expect(container).toBeAccessible();
		jest.useFakeTimers();
	});

	it('should show tooltip on copy link button', async () => {
		const { event } = await setup();

		const content = await screen.findByTestId('smart-block-title-resolved-view');
		const copyButton = await screen.findByTestId('smart-action-copy-link-action');
		expect(screen.queryByRole('tooltip')).toBeNull();
		await event.hover(copyButton);
		const tooltip = await screen.findByRole('tooltip');

		expect(content).toBeTruthy();
		expect(tooltip).toHaveTextContent('Copy link');
	});

	describe('show-hide behaviour', () => {
		const {
			testIds: { secondaryChildTestId },
		} = config;

		it('renders hover card', async () => {
			await setup();
			act(() => {
				jest.runAllTimers();
			});
			expect(await screen.findByTestId('hover-card')).toBeInTheDocument();
		});

		it('should wait a default delay before showing', async () => {
			await setup({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			act(() => {
				jest.advanceTimersByTime(499); // Delay not completed yet
			});
			expect(screen.queryByTestId('hover-card')).not.toBeInTheDocument();
			act(() => {
				jest.advanceTimersByTime(1); // Delay completed
			});

			expect(await screen.findByTestId('hover-card')).toBeInTheDocument();
		});

		it('should wait a custom delay before showing if provided', async () => {
			await setup({
				userEventOptions: userEventOptionsWithAdvanceTimers,
				extraCardProps: { hoverPreviewOptions: { fadeInDelay: 1000 } },
			});

			act(() => {
				jest.advanceTimersByTime(999); // Delay not completed yet
			});
			expect(screen.queryByTestId('hover-card')).not.toBeInTheDocument();
			act(() => {
				jest.advanceTimersByTime(1); // Delay completed
			});

			expect(await screen.findByTestId('hover-card')).toBeInTheDocument();
		});

		it('should wait a default delay before hiding', async () => {
			const { element, event } = await setup({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});
			act(() => {
				jest.runAllTimers();
			});
			await event.unhover(element);
			act(() => {
				jest.advanceTimersByTime(299); // Delay not completed yet
			});

			expect(screen.queryByTestId('hover-card')).toBeInTheDocument();

			act(() => {
				jest.advanceTimersByTime(1); // Delay completed
			});

			expect(screen.queryByTestId('hover-card')).not.toBeInTheDocument();
		});

		it('should stay shown if theres a mouseEnter before the delay elapses', async () => {
			const { element, event } = await setup({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			act(() => {
				jest.runAllTimers();
			});
			await event.unhover(element);
			act(() => {
				jest.advanceTimersByTime(299); // Delay not completed yet
			});

			expect(screen.queryByTestId('hover-card')).toBeInTheDocument();

			await event.hover(element);
			act(() => {
				jest.advanceTimersByTime(1); // Delay completed
			});

			expect(screen.queryByTestId('hover-card')).toBeInTheDocument();
		});

		it('should stay hidden if there is a mouseLeave before the delay elapses', async () => {
			const { element, event } = await setup({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			act(() => {
				jest.advanceTimersByTime(299); // Delay not completed yet
			});

			expect(screen.queryByTestId('hover-card')).not.toBeInTheDocument();
			await event.unhover(element);
			await act(async () => {
				jest.advanceTimersByTime(1); // Delay completed
			});

			expect(screen.queryByTestId('hover-card')).not.toBeInTheDocument();
		});

		it('should stay shown if mouse moves over the hover card', async () => {
			const { event } = await setup();

			const hoverCard = await screen.findByTestId('hover-card');
			await event.hover(hoverCard);

			expect(screen.queryByTestId('hover-card')).toBeInTheDocument();
		});

		it('should hide if mouse moves on the hover card and then leaves it', async () => {
			const { event } = await setup();

			const hoverCard = await screen.findByTestId('hover-card');
			await event.hover(hoverCard);

			await event.unhover(hoverCard);
			act(() => {
				jest.runAllTimers();
			});

			expect(screen.queryByTestId('hover-card')).not.toBeInTheDocument();
		});

		it('should hide the card if a mouse sends multiple mouse over events but leaves the hover area before the delay elapses', async () => {
			const { element, event } = await setup({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			act(() => {
				jest.advanceTimersByTime(100);
			});
			const titleAndIcon = await screen.findAllByTestId(secondaryChildTestId);
			await event.hover(titleAndIcon[0]);
			act(() => {
				jest.advanceTimersByTime(199);
			});

			expect(screen.queryByTestId('hover-card')).not.toBeInTheDocument();

			await event.unhover(element);
			act(() => {
				jest.advanceTimersByTime(1);
			});

			expect(screen.queryByTestId('hover-card')).not.toBeInTheDocument();
		});

		it('should show the card in 500ms the card if a mouse sends multiple mouse over events over children', async () => {
			await setup({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			act(() => {
				jest.advanceTimersByTime(300);
			});

			const titleAndIcon = await screen.findAllByTestId(secondaryChildTestId);

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

			expect(screen.queryByTestId('hover-card')).toBeInTheDocument();
		});

		it('should hide after pressing escape', async () => {
			const { event } = await setup();
			await act(async () => {
				await event.keyboard('{Escape}'); // This causes an act error
			});
			expect(screen.queryByTestId('hover-card')).not.toBeInTheDocument();
		});

		it('should close hover card when a user right clicks on child', async () => {
			const { element, event } = await setup();

			expect(await screen.findByTestId('hover-card')).toBeInTheDocument();
			await event.pointer({ keys: '[MouseRight>]', target: element });

			expect(screen.queryByTestId('hover-card')).not.toBeInTheDocument();
		});
	});

	it('renders hover card redesign', async () => {
		await setup();
		const actionBlock = await screen.findByTestId('smart-block-action');
		expect(actionBlock).toBeInTheDocument();
	});

	describe('client-side actions', () => {
		it('should render smartlink actions', async () => {
			await setup();
			const downloadButton = await screen.findByTestId('smart-action-download-action');
			const previewButton = await screen.findByTestId('smart-action-preview-action');

			expect(downloadButton).toHaveTextContent('Download file');
			expect(previewButton).toHaveTextContent('Open preview');
		});

		it('should not render smartlinks actions if disabled', async () => {
			await setup();

			expect(screen.queryByTestId('smart-action-download-action')).not.toBeInTheDocument();
			expect(screen.queryByTestId('smart-action-preview-action')).not.toBeInTheDocument();
		});

		it('should not render client actions that are excluded', async () => {
			await setup({
				extraCardProps: {
					actionOptions: { hide: false, exclude: [CardAction.DownloadAction] },
				},
			});

			expect(screen.queryByTestId('smart-action-download-action')).not.toBeInTheDocument();
			expect(screen.queryByTestId('smart-action-preview-action')).toBeDefined();
		});

		it('should open preview modal after clicking preview button', async () => {
			const { event } = await setup();

			const previewButton = await screen.findByTestId('smart-action-preview-action');
			await event.click(previewButton);
			const previewModal = await screen.findByTestId('smart-embed-preview-modal');
			expect(previewModal).toBeInTheDocument();

			await screen.findByTestId('block-card-icon');

			const hoverCard = screen.queryByTestId('hover-card');
			expect(hoverCard).not.toBeInTheDocument();
		});

		it('renders copy link action', async () => {
			await setup();
			const hoverCard = await screen.findByTestId('hover-card');
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

					const { event } = await setup({
						mock,
						extraCardProps: { url: 'http://some-preview-url-test.com' },
					});

					const previewButton = await screen.findByTestId('smart-action-preview-action');
					await event.click(previewButton);
					const iframeEl = await screen.findByTestId(`smart-embed-preview-modal-embed`);
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

		const getCardProps = (actionOptions?: CardActionOptions) => ({
			extraCardProps: {
				actionOptions,
			},
			mock,
		});

		it('shows server action when option not provided', async () => {
			await setup(getCardProps());

			const actionElement = await screen.findByTestId(elementId);
			expect(actionElement).toBeInTheDocument();
		});

		it('shows server actions when actionOptions is provided and hide is false', async () => {
			await setup(getCardProps({ hide: false }));

			const actionElement = await screen.findByTestId(elementId);
			expect(actionElement).toBeInTheDocument();
		});

		it('hides excluded server actions when actionOptions.excluded is provided', async () => {
			await setup(
				getCardProps({
					hide: false,
					exclude: [CardAction.ChangeStatusAction],
				}),
			);

			const actionElement = screen.queryByTestId(elementId);

			expect(actionElement).not.toBeInTheDocument();
		});

		it('does not show server actions when actionOptions is provided and hide is true', async () => {
			await setup(getCardProps({ hide: true }));

			const actionElement = screen.queryByTestId(elementId);

			expect(actionElement).not.toBeInTheDocument();
		});

		it('fires the buttonClicked event on a click of the status lozenge', async () => {
			const { analyticsSpy, event } = await setup(getCardProps());

			const actionElement = await screen.findByTestId(elementId);
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
			await setup({
				mock: mockBaseResponseWithErrorPreview,
				mockFetch: mockFetch,
				testId: erroredTestId,
			});
			await expect(() => screen.findByTestId('hover-card-loading-view')).rejects.toThrow();
		});
	});
};
