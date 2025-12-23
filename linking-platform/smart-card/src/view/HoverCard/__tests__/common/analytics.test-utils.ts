import { act, screen, within } from '@testing-library/react';

import MockAtlasProject from '../../../../__fixtures__/atlas-project';
import * as analytics from '../../../../utils/analytics/analytics';
import * as HoverCardComponent from '../../components/HoverCardComponent';
import { mockBaseResponseWithDownload, mockBaseResponseWithPreview } from '../__mocks__/mocks';

import {
	type setup as hoverCardSetup,
	mockIntersectionObserver,
	type SetUpParams,
} from './setup.test-utils';

type AnalyticsTestConfig = {
	/**
	 * The display of a link that triggered the hover card
	 */
	display?: 'inline' | 'flexible';

	/**
	 * Indicates whether analytics context details are already in store when the link is hovered
	 * For example, for standalone card which has not previously been in the store, there will be no information in the store on the initial hover
	 */
	isAnalyticsContextResolvedOnHover: boolean;
};

export const analyticsTests = (
	setup: (params?: SetUpParams) => ReturnType<typeof hoverCardSetup>,
	_config: AnalyticsTestConfig,
): void => {
	describe('analytics', () => {
		beforeEach(() => {
			jest.useFakeTimers({ legacyFakeTimers: true });
			mockIntersectionObserver();
			act(() => jest.runAllTimers());
			jest.restoreAllMocks();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('should fire hover card viewed event with correct data in the analytics context', async () => {
			const { mockAnalyticsClient } = await setup();
			await screen.findByTestId('hover-card');
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'viewed',
					actionSubject: 'hoverCard',
					attributes: expect.objectContaining({
						previewDisplay: 'card',
						previewInvokeMethod: 'mouse_hover',
						status: 'resolved',
					}),
				}),
			);
		});

		it('should fire viewed event when hover card is opened', async () => {
			const { mockAnalyticsClient } = await setup();

			// wait for card to be resolved
			const hoverCard = await screen.findByTestId('hover-card');
			within(hoverCard).getByTestId('smart-block-title-resolved-view');
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'viewed',
					actionSubject: 'hoverCard',
					attributes: expect.objectContaining({
						previewDisplay: 'card',
						previewInvokeMethod: 'mouse_hover',
						status: 'resolved',
					}),
				}),
			);
		});

		it('should fire closed event when hover card is opened then closed', async () => {
			const { element, event, mockAnalyticsClient } = await setup();
			// wait for card to be resolved
			const hoverCard = await screen.findByTestId('hover-card');
			within(hoverCard).getByTestId('smart-block-title-resolved-view');
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
						status: 'resolved',
						hoverTime: 0,
					}),
				}),
			);
		});

		it('should fire clicked event when title is clicked', async () => {
			const { event, mockAnalyticsClient } = await setup();
			act(() => {
				jest.runAllTimers();
			});

			const hoverCard = await screen.findByTestId('hover-card');
			const link = within(hoverCard).getByTestId('smart-element-link');

			await event.click(link);

			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'smartLink',
					actionSubjectId: 'titleGoToLink',
					attributes: expect.objectContaining({
						definitionId: 'd1',
						extensionKey: 'confluence-object-provider',
						status: 'resolved',
						isModifierKeyPressed: false,
						display: 'hoverCardPreview',
					}),
				}),
			);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'link',
					action: 'clicked',
					attributes: expect.objectContaining({
						definitionId: 'd1',
						extensionKey: 'confluence-object-provider',
						status: 'resolved',
						display: 'hoverCardPreview',
					}),
				}),
			);

			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'smartLink',
					attributes: expect.objectContaining({
						definitionId: 'd1',
						extensionKey: 'confluence-object-provider',
						status: 'resolved',
						display: 'hoverCardPreview',
					}),
				}),
			);
		});

		it('should fire clicked event when title is middle clicked', async () => {
			const { analyticsSpy, event } = await setup();

			await screen.findByTestId('smart-block-title-resolved-view');
			const link = await screen.findByTestId('smart-element-link');

			await event.click(link);

			expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'clicked',
						actionSubject: 'link',
					},
				},
				analytics.ANALYTICS_CHANNEL,
			);
		});

		it('should fire clicked event when title is right clicked', async () => {
			const { analyticsSpy, event } = await setup();

			await screen.findByTestId('smart-block-title-resolved-view');
			const link = await screen.findByTestId('smart-element-link');

			// @ts-ignore
			await event.click(link, { button: 2 });

			expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'clicked',
						actionSubject: 'link',
					},
				},
				analytics.ANALYTICS_CHANNEL,
			);
		});

		it('should fire link clicked event with attributes from SmartLinkAnalyticsContext if link is resolved', async () => {
			const { mockAnalyticsClient, event } = await setup({
				extraCardProps: { id: 'some-id' },
			});

			const hoverCard = await screen.findByTestId('hover-card');
			within(hoverCard).getByTestId('smart-block-title-resolved-view');
			const link = within(hoverCard).getByTestId('smart-element-link');

			await event.click(link);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'link',
					attributes: expect.objectContaining({
						extensionKey: 'confluence-object-provider',
						status: 'resolved',
					}),
				}),
			);
		});

		it('should fire clicked event and close event when preview button is clicked', async () => {
			const { event, mockAnalyticsClient } = await setup({
				mock: mockBaseResponseWithPreview,
			});

			await screen.findByTestId('smart-block-title-resolved-view');
			const button = await screen.findByTestId('smart-action-preview-action');
			await event.click(button);

			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'invokePreviewScreen',
					attributes: expect.objectContaining({
						actionType: 'PreviewAction',
						display: 'hoverCardPreview',
						extensionKey: 'test-object-provider',
					}),
				}),
			);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'dismissed',
					actionSubject: 'hoverCard',
					attributes: expect.objectContaining({
						previewDisplay: 'card',
						previewInvokeMethod: 'mouse_hover',
						status: 'resolved',
						extensionKey: 'test-object-provider',
						hoverTime: 0,
					}),
				}),
			);
		});

		it('should fire clicked event when download button is clicked', async () => {
			const { event, mockAnalyticsClient } = await setup({
				mock: mockBaseResponseWithDownload,
			});

			await screen.findByTestId('smart-block-title-resolved-view');
			const button = await screen.findByTestId('smart-action-download-action');

			await event.click(button);

			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'downloadDocument',
					attributes: expect.objectContaining({
						actionType: 'DownloadAction',
						display: 'hoverCardPreview',
						extensionKey: 'test-object-provider',
					}),
				}),
			);
		});

		it('should fire clicked event when follow button is clicked', async () => {
			expect(true).toBe(true);
			const { analyticsSpy, event } = await setup({
				mock: MockAtlasProject,
			});

			const hoverCard = await screen.findByTestId('hover-card');
			within(hoverCard).getByTestId('smart-block-title-resolved-view');
			const button = within(hoverCard).getByTestId('smart-action-follow-action');

			await act(async () => {
				await event.click(button); // This causes an act error
			});

			expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'clicked',
						actionSubject: 'button',
						actionSubjectId: 'smartLinkFollowButton',
					},
				},
				analytics.ANALYTICS_CHANNEL,
			);
			expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'started',
						actionSubject: 'smartLinkQuickAction',
					},
				},
				analytics.ANALYTICS_CHANNEL,
			);
			expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'success',
						actionSubject: 'smartLinkQuickAction',
					},
				},
				analytics.ANALYTICS_CHANNEL,
			);
		});

		it('should fire render failed event when hover card errors during render', async () => {
			jest.spyOn(HoverCardComponent, 'HoverCardComponent').mockImplementation(() => {
				throw new Error('something happened');
			});

			// setup function implicitly tests that the inline link resolved view is still in the DOM
			const { mockAnalyticsClient } = await setup();
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'renderFailed',
					actionSubject: 'smartLink',
					attributes: expect.objectContaining({
						error: new Error('something happened'),
						errorInfo: expect.any(Object),
						display: 'hoverCardPreview',
					}),
				}),
			);
		});
	});
};
