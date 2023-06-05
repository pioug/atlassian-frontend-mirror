jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock(
  'react-transition-group/Transition',
  () => (data: any) => data.children,
);
jest.doMock('../../../utils/analytics/analytics');
jest.mock('react-render-image', () => ({ src, errored, onError }: any) => {
  switch (src) {
    case 'src-error':
      onError && onError();
      return errored;
    default:
      return null;
  }
});

import '@atlaskit/link-test-helpers/jest';
import {
  MockIntersectionObserverFactory,
  MockIntersectionObserverOpts,
} from '@atlaskit/link-test-helpers';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import React, { ReactElement, useEffect } from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import {
  AnalyticsListener,
  useAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { fakeFactory } from '../../../utils/mocks';
import { CardClient } from '@atlaskit/link-provider';
import { CardProps, Provider, ProviderProps, TitleBlock } from '../../..';
import * as analytics from '../../../utils/analytics/analytics';
import { Card } from '../../Card';
import { IntlProvider } from 'react-intl-next';
import {
  mockBaseResponseWithDownload,
  mockBaseResponseWithErrorPreview,
  mockBaseResponseWithPreview,
  mockConfluenceResponse,
  mockIframelyResponse,
  mockJiraResponse,
  mockSSRResponse,
  mockUnauthorisedResponse,
} from './__mocks__/mocks';
import * as HoverCardComponent from '../components/HoverCardComponent';
import { HoverCard } from '../../../hoverCard';
import { PROVIDER_KEYS_WITH_THEMING } from '../../../extractors/constants';
import { setGlobalTheme } from '@atlaskit/tokens';

const mockUrl = 'https://some.url';

describe('HoverCard', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockGetEntries: jest.Mock;
  let mockIntersectionObserverOpts: MockIntersectionObserverOpts;

  const setup = async ({
    mock = mockConfluenceResponse,
    featureFlags,
    testId = 'inline-card-resolved-view',
    component,
    extraCardProps,
  }: {
    mock?: any;
    featureFlags?: ProviderProps['featureFlags'];
    testId?: string;
    component?: ReactElement;
    extraCardProps?: Partial<CardProps>;
  } = {}) => {
    mockFetch = jest.fn(() => Promise.resolve(mock));
    mockClient = new (fakeFactory(mockFetch))();
    const analyticsSpy = jest.fn();
    setGlobalTheme({ colorMode: 'dark' });

    const { queryByTestId, findByTestId } = render(
      <AnalyticsListener
        channel={analytics.ANALYTICS_CHANNEL}
        onEvent={analyticsSpy}
      >
        <IntlProvider locale="en">
          <Provider client={mockClient} featureFlags={featureFlags}>
            {component ? (
              component
            ) : (
              <Card
                appearance="inline"
                url={mockUrl}
                showHoverPreview={true}
                {...extraCardProps}
              />
            )}
          </Provider>
        </IntlProvider>
      </AnalyticsListener>,
    );

    const element = await findByTestId(testId);
    jest.useFakeTimers();
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date('April 1, 2022 00:00:00').getTime());

    fireEvent.mouseEnter(element);

    Object.assign(navigator, {
      clipboard: {
        writeText: () => {},
      },
    });

    return { findByTestId, queryByTestId, element, analyticsSpy };
  };

  const serverActionsTest = (
    renderComponent: (showServerActions?: boolean) => ReturnType<typeof setup>,
  ) => {
    const elementId = 'state-metadata-element--trigger';

    it('shows server actions when enabled', async () => {
      const { findByTestId } = await renderComponent(true);
      jest.runAllTimers();

      const actionElement = await findByTestId(elementId);
      expect(actionElement).toBeInTheDocument();
    });

    it('does not show server actions when disable', async () => {
      const { queryByTestId } = await renderComponent(false);
      jest.runAllTimers();

      const actionElement = queryByTestId(elementId);

      expect(actionElement).not.toBeInTheDocument();
    });

    it('does not show server action when option not provided', async () => {
      const { queryByTestId } = await renderComponent();
      jest.runAllTimers();

      const actionElement = queryByTestId(elementId);

      expect(actionElement).not.toBeInTheDocument();
    });

    it('fires the buttonClicked event on a click of the status lozenge', async () => {
      const { findByTestId, analyticsSpy } = await renderComponent(true);
      jest.runAllTimers();

      const actionElement = await findByTestId(elementId);
      expect(actionElement).toBeInTheDocument();
      act(() => {
        fireEvent.click(actionElement);
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

    describe('feature discovery', () => {
      const fdTestId = `state-metadata-element-discovery`;

      beforeEach(() => {
        localStorage.clear();
      });

      it('shows feature discovery component', async () => {
        const { findByTestId } = await renderComponent(true);
        jest.runAllTimers();

        const element = await findByTestId(fdTestId);
        expect(element).toBeInTheDocument();
      });

      it('does not show feature discovery component twice', async () => {
        const { element, findByTestId, queryByTestId } = await renderComponent(
          true,
        );
        jest.runAllTimers();

        // Confirm that feature discovery component is showing
        await findByTestId(fdTestId);

        // Close hover preview and trigger it to open again
        fireEvent.mouseLeave(element);
        jest.runAllTimers();
        fireEvent.mouseEnter(element);
        jest.runAllTimers();

        const fdElement = queryByTestId(fdTestId);
        expect(fdElement).not.toBeInTheDocument();
      });
    });
  };

  beforeEach(() => {
    mockGetEntries = jest
      .fn()
      .mockImplementation(() => [{ isIntersecting: true }]);
    mockIntersectionObserverOpts = {
      disconnect: jest.fn(),
      getMockEntries: mockGetEntries,
    };
    // Gives us access to a mock IntersectionObserver, which we can
    // use to spoof visibility of a Smart Link.
    window.IntersectionObserver = MockIntersectionObserverFactory(
      mockIntersectionObserverOpts,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('smart-card', () => {
    it('renders hover card', async () => {
      const { findByTestId } = await setup();
      jest.runAllTimers();
      const hoverCard = await findByTestId('hover-card');

      expect(hoverCard).toBeTruthy();
    });

    describe('hover card viewed event has correct data the analytics context', () => {
      ffTest(
        'platform.linking-platform.smart-card.enable-analytics-context',
        (ff) => {
          ffTest(
            'platform.linking-platform.smart-card.refactor-hover-card-analytics',
            async () => {
              const { findByTestId, analyticsSpy } = await setup();
              jest.runAllTimers();
              await findByTestId('hover-card');

              expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
                payload: {
                  action: 'viewed',
                  actionSubject: 'hoverCard',
                  attributes: {
                    previewDisplay: 'card',
                    previewInvokeMethod: 'mouse_hover',
                    status: 'resolved',
                  },
                },
                context: [
                  {
                    componentName: 'smart-cards',
                  },
                  {
                    attributes: {
                      display: 'inline',
                    },
                  },
                  {
                    attributes: {
                      extensionKey: 'confluence-object-provider',
                      status: 'resolved',
                    },
                  },
                  {
                    attributes: {
                      display: 'hoverCardPreview',
                    },
                    source: 'smartLinkPreviewHoverCard',
                  },
                  {
                    attributes: {
                      extensionKey: 'confluence-object-provider',
                      status: 'resolved',
                    },
                  },
                ],
              });
            },
            async () => {
              const { findByTestId, analyticsSpy } = await setup();
              jest.runAllTimers();
              await findByTestId('hover-card');

              expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
                payload: {
                  action: 'viewed',
                  actionSubject: 'hoverCard',
                  attributes: {
                    previewDisplay: 'card',
                    previewInvokeMethod: 'mouse_hover',
                    status: 'resolved',
                  },
                },
                context: [
                  {
                    componentName: 'smart-cards',
                  },
                  {
                    attributes: {
                      display: 'inline',
                    },
                  },
                  {
                    attributes: {
                      extensionKey: 'confluence-object-provider',
                    },
                  },
                  {
                    attributes: {
                      display: 'hoverCardPreview',
                    },
                    source: 'smartLinkPreviewHoverCard',
                  },
                ],
              });
            },
            ff,
          );
        },
        async () => {
          const { findByTestId, analyticsSpy } = await setup();
          jest.runAllTimers();
          await findByTestId('hover-card');

          expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
            payload: {
              action: 'viewed',
              actionSubject: 'hoverCard',
              attributes: {
                previewDisplay: 'card',
                previewInvokeMethod: 'mouse_hover',
                status: 'resolved',
              },
            },
            context: [
              {
                componentName: 'smart-cards',
                packageName: '@atlaskit/smart-card',
                packageVersion: '999.9.9',
              },
              {
                attributes: {
                  display: 'hoverCardPreview',
                },
                source: 'smartLinkPreviewHoverCard',
              },
            ],
          });
        },
      );
    });

    it('renders hover card blocks', async () => {
      const { findByTestId } = await setup();
      jest.runAllTimers();
      const titleBlock = await findByTestId('smart-block-title-resolved-view');
      await findByTestId('smart-block-metadata-resolved-view');
      const snippetBlock = await findByTestId(
        'smart-block-snippet-resolved-view',
      );
      const footerBlock = await findByTestId(
        'smart-footer-block-resolved-view',
      );
      //trim because the icons are causing new lines in the textContent
      expect(titleBlock.textContent?.trim()).toBe('I love cheese');
      expect(snippetBlock.textContent).toBe('Here is your serving of cheese');
      expect(footerBlock.textContent?.trim()).toBe(
        'ConfluenceCommentFull screen view',
      );
    });

    it('renders hover card blocks with new preview action', async () => {
      const { findByTestId } = await setup({
        featureFlags: { enableImprovedPreviewAction: true },
      });
      jest.runAllTimers();
      const titleBlock = await findByTestId('smart-block-title-resolved-view');
      await findByTestId('smart-block-metadata-resolved-view');
      const snippetBlock = await findByTestId(
        'smart-block-snippet-resolved-view',
      );
      const footerBlock = await findByTestId(
        'smart-footer-block-resolved-view',
      );
      //trim because the icons are causing new lines in the textContent
      expect(titleBlock.textContent?.trim()).toBe('I love cheese');
      expect(snippetBlock.textContent).toBe('Here is your serving of cheese');
      expect(footerBlock.textContent?.trim()).toBe(
        'ConfluenceCommentOpen preview',
      );
    });

    it('should render preview instead of snippet when preview data is available', async () => {
      const { findByTestId, queryByTestId } = await setup({
        mock: mockBaseResponseWithPreview,
      });
      jest.runAllTimers();
      await findByTestId('smart-block-title-resolved-view');
      await findByTestId('smart-block-preview-resolved-view');

      expect(queryByTestId('smart-block-snippet-resolved-view')).toBeNull();
    });

    it('should fallback to rendering snippet if preview data is available but fails to load', async () => {
      const { findByTestId, queryByTestId } = await setup({
        mock: mockBaseResponseWithErrorPreview,
      });
      jest.runAllTimers();
      await findByTestId('smart-block-title-resolved-view');
      fireEvent.transitionEnd(
        await findByTestId('smart-block-preview-resolved-view'),
      );
      await findByTestId('smart-block-snippet-resolved-view');

      expect(queryByTestId('smart-block-preview-resolved-view')).toBeNull();
    });

    describe('metadata', () => {
      it('renders correctly for confluence links', async () => {
        const { findByTestId } = await setup();
        jest.runAllTimers();
        await findByTestId('authorgroup-metadata-element');
        const createdBy = await findByTestId('createdby-metadata-element');
        const commentCount = await findByTestId(
          'commentcount-metadata-element',
        );
        const reactCount = await findByTestId('reactcount-metadata-element');

        expect(createdBy.textContent).toBe('Created by Michael Schrute');
        expect(commentCount.textContent).toBe('4');
        expect(reactCount.textContent).toBe('8');
      });

      it('renders correctly for jira links', async () => {
        const { findByTestId } = await setup({ mock: mockJiraResponse });
        jest.runAllTimers();
        await findByTestId('authorgroup-metadata-element');
        const priority = await findByTestId('priority-metadata-element');
        const state = await findByTestId('state-metadata-element');

        expect(priority.textContent).toBe('Major');
        expect(state.textContent).toBe('Done');
      });

      it('renders correctly for other providers', async () => {
        const { findByTestId } = await setup({ mock: mockIframelyResponse });
        jest.runAllTimers();
        const titleBlock = await findByTestId(
          'smart-block-title-resolved-view',
        );
        const modifiedOn = await findByTestId('modifiedon-metadata-element');
        const createdBy = await findByTestId('createdby-metadata-element');

        expect(titleBlock.textContent?.trim()).toBe('I love cheese');
        expect(modifiedOn.textContent).toBe('Updated on Jan 1, 2022');
        expect(createdBy.textContent).toBe('Created by Michael Schrute');
      });
    });

    describe('when mouse moves over the child', () => {
      it('should wait a default delay before showing', async () => {
        const { queryByTestId } = await setup();

        // Delay not completed yet
        jest.advanceTimersByTime(299);

        expect(queryByTestId('hover-card')).toBeNull();

        // Delay completed
        jest.advanceTimersByTime(1);

        expect(queryByTestId('hover-card')).not.toBeNull();
      });

      it('should wait a default delay before hiding', async () => {
        const { queryByTestId, element } = await setup();
        jest.runAllTimers();
        fireEvent.mouseLeave(element);

        // Delay not completed yet
        jest.advanceTimersByTime(299);

        expect(queryByTestId('hover-card')).not.toBeNull();

        // Delay completed
        jest.advanceTimersByTime(1);

        expect(queryByTestId('hover-card')).toBeNull();
      });
    });

    it('should stay shown if theres a mouseEnter before the delay elapses', async () => {
      const { queryByTestId, element } = await setup();
      jest.runAllTimers();
      fireEvent.mouseLeave(element);

      // Delay not completed yet
      jest.advanceTimersByTime(299);
      expect(queryByTestId('hover-card')).not.toBeNull();

      fireEvent.mouseEnter(element);

      // Delay completed
      jest.advanceTimersByTime(1);

      expect(queryByTestId('hover-card')).not.toBeNull();
    });

    it('should stay hidden if theres a mouseLeave before the delay elapses', async () => {
      const { queryByTestId, element } = await setup();

      // Delay not completed yet
      jest.advanceTimersByTime(299);

      expect(queryByTestId('hover-card')).toBeNull();
      fireEvent.mouseLeave(element);

      // Delay completed
      jest.advanceTimersByTime(1);

      expect(queryByTestId('hover-card')).toBeNull();
    });

    it('should stay shown if mouse moves over the hover card', async () => {
      const { findByTestId, queryByTestId, element } = await setup();

      jest.runAllTimers();

      const hoverCard = await findByTestId('smart-links-container');
      fireEvent.mouseLeave(element);
      fireEvent.mouseEnter(hoverCard);

      jest.runAllTimers();

      expect(queryByTestId('hover-card')).not.toBeNull();
    });

    it('should hide if mouse moves leaves the hover card', async () => {
      const { findByTestId, queryByTestId, element } = await setup();

      jest.runAllTimers();

      const hoverCard = await findByTestId('smart-links-container');
      fireEvent.mouseLeave(element);
      fireEvent.mouseEnter(hoverCard);
      fireEvent.mouseLeave(hoverCard);

      jest.runAllTimers();

      expect(queryByTestId('hover-card')).toBeNull();
    });

    it('should hide after pressing escape', async () => {
      const { queryByTestId } = await setup();

      jest.runAllTimers();

      fireEvent.keyDown(document, { key: 'Escape', code: 27 });

      expect(queryByTestId('hover-card')).toBeNull();
    });

    it('should render smartlink actions', async () => {
      const { findByTestId } = await setup();
      jest.runAllTimers();
      const commentButton = await findByTestId('comment');
      const previewButton = await findByTestId('preview-content');

      expect(commentButton.textContent).toBe('Comment');
      expect(previewButton.textContent).toBe('Full screen view');
    });

    it('should render smartlink actions with improved preview action feature flag', async () => {
      const { findByTestId } = await setup({
        featureFlags: { enableImprovedPreviewAction: true },
      });
      jest.runAllTimers();
      const commentButton = await findByTestId('comment');
      const previewButton = await findByTestId('preview-content');

      expect(commentButton.textContent).toBe('Comment');
      expect(previewButton.textContent).toBe('Open preview');
    });

    it('should still render the full screen view action on inline link hover when disabled via flexui prop', async () => {
      const { findByTestId } = await setup({
        extraCardProps: { ui: { hideHoverCardPreviewButton: true } },
      });
      jest.runAllTimers();
      const previewButton = await findByTestId('preview-content');
      expect(previewButton.textContent).toBe('Full screen view');
    });

    it('should still render the full screen view action on inline link hover when disabled via flexui prop with improved preview action feature flag', async () => {
      const { findByTestId } = await setup({
        featureFlags: { enableImprovedPreviewAction: true },
        extraCardProps: {
          ui: { hideHoverCardPreviewButton: true },
        },
      });
      jest.runAllTimers();
      const previewButton = await findByTestId('preview-content');
      expect(previewButton.textContent).toBe('Open preview');
    });

    it('should open preview modal after clicking preview button', async () => {
      const { findByTestId, queryByTestId } = await setup();
      jest.runAllTimers();
      const previewButton = await findByTestId('preview-content');
      fireEvent.click(previewButton);
      const previewModal = await findByTestId('preview-modal');

      expect(previewModal).toBeTruthy();

      const hoverCard = queryByTestId('hover-card');
      expect(hoverCard).toBeNull();
    });

    it.each([...PROVIDER_KEYS_WITH_THEMING, 'not-supported-provider'])(
      'should add themMode query param if theming is supported',
      async (providerKey) => {
        const expectedPreviewUrl = 'http://some-preview-url.com';

        const { findByTestId } = await setup({
          mock: {
            ...mockConfluenceResponse,
            meta: { ...mockConfluenceResponse.meta, key: providerKey },
            data: {
              ...mockConfluenceResponse.data,
              preview: {
                '@type': 'Link',
                href: expectedPreviewUrl,
              },
            },
          },
        });
        jest.runAllTimers();
        const previewButton = await findByTestId('preview-content');
        fireEvent.click(previewButton);
        const iframeEl = await findByTestId(`smart-embed-preview-modal-embed`);
        expect(iframeEl).toBeTruthy();

        if (providerKey !== 'not-supported-provider') {
          expect(iframeEl.getAttribute('src')).toEqual(
            `${expectedPreviewUrl}?themeMode=dark`,
          );
        } else {
          expect(iframeEl.getAttribute('src')).toEqual(expectedPreviewUrl);
        }
      },
    );

    it('should render open action', async () => {
      const { findByTestId } = await setup();
      jest.runAllTimers();
      const openButton = await findByTestId('hover-card-open-button');

      expect(openButton).toBeTruthy();
    });

    it('should show tooltip on hover card open button', async () => {
      const mockOpen = jest.fn();
      // @ts-ignore
      global.open = mockOpen;
      const { findByTestId } = await setup();
      jest.runAllTimers();

      const content = await findByTestId('smart-block-title-resolved-view');
      const openButton = await findByTestId('hover-card-open-button');
      fireEvent.mouseOver(openButton);
      const tooltip = await findByTestId('hover-card-open-button-tooltip');

      expect(content).toBeTruthy();
      expect(tooltip.textContent).toBe('Open link in a new tab');
    });

    it('should show tooltip on copy link button', async () => {
      const { findByTestId } = await setup();
      jest.runAllTimers();

      const content = await findByTestId('smart-block-title-resolved-view');
      const copyButton = await findByTestId('hover-card-copy-button');
      fireEvent.mouseOver(copyButton);
      const tooltip = await findByTestId('hover-card-copy-button-tooltip');

      expect(content).toBeTruthy();
      expect(tooltip.textContent).toBe('Copy link');
    });

    it('should open url in a new tab after clicking open button', async () => {
      const mockOpen = jest.fn();
      // @ts-ignore
      global.open = mockOpen;
      const { findByTestId } = await setup();
      jest.runAllTimers();

      const content = await findByTestId('smart-block-title-resolved-view');
      const openButton = await findByTestId('hover-card-open-button');
      fireEvent.click(openButton);

      expect(open).toHaveBeenCalledWith('https://some.url', '_blank');
      expect(content).toBeTruthy();
      mockOpen.mockRestore();
    });

    describe('analytics', () => {
      it('should fire viewed event when hover card is opened', async () => {
        const mock = jest.spyOn(analytics, 'uiHoverCardViewedEvent');

        const { findByTestId } = await setup();
        jest.runAllTimers();

        //wait for card to be resolved
        await findByTestId('smart-block-title-resolved-view');
        expect(analytics.uiHoverCardViewedEvent).toHaveBeenCalledTimes(1);
        expect(mock.mock.results[0].value).toEqual({
          action: 'viewed',
          actionSubject: 'hoverCard',
          attributes: {
            componentName: 'smart-cards',
            definitionId: 'd1',
            id: expect.any(String),
            extensionKey: 'confluence-object-provider',
            packageName: '@atlaskit/smart-card',
            packageVersion: '999.9.9',
            previewDisplay: 'card',
            previewInvokeMethod: 'mouse_hover',
            status: 'resolved',
          },
          eventType: 'ui',
        });
      });

      it('should fire closed event when hover card is opened then closed', async () => {
        const mock = jest.spyOn(analytics, 'uiHoverCardDismissedEvent');

        const { queryByTestId, findByTestId, element } = await setup();
        jest.runAllTimers();
        // wait for card to be resolved
        await findByTestId('smart-block-title-resolved-view');
        fireEvent.mouseLeave(element);
        jest.runAllTimers();
        expect(queryByTestId('hover-card')).toBeNull();

        expect(analytics.uiHoverCardDismissedEvent).toHaveBeenCalledTimes(1);
        expect(mock.mock.results[0].value).toEqual({
          action: 'dismissed',
          actionSubject: 'hoverCard',
          attributes: {
            componentName: 'smart-cards',
            definitionId: 'd1',
            id: expect.any(String),
            extensionKey: 'confluence-object-provider',
            hoverTime: 0,
            packageName: '@atlaskit/smart-card',
            packageVersion: '999.9.9',
            previewDisplay: 'card',
            previewInvokeMethod: 'mouse_hover',
            status: 'resolved',
          },
          eventType: 'ui',
        });
      });

      it('should fire render success event when hover card is rendered', async () => {
        const spy = jest.spyOn(analytics, 'uiRenderSuccessEvent');
        const { findByTestId } = await setup();
        jest.runAllTimers();
        await findByTestId('smart-block-title-resolved-view');

        // First render event is from the inline card
        // Second render event is flexible ui inside the hover card
        expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledTimes(2);
        expect(spy.mock.results[1].value).toEqual({
          action: 'renderSuccess',
          actionSubject: 'smartLink',
          attributes: {
            id: expect.any(String),
            componentName: 'smart-cards',
            definitionId: 'd1',
            display: 'hoverCardPreview',
            extensionKey: 'confluence-object-provider',
            packageName: '@atlaskit/smart-card',
            packageVersion: '999.9.9',
            status: 'resolved',
          },
          eventType: 'ui',
        });
      });

      it('should fire clicked event when title is clicked', async () => {
        const spy = jest.spyOn(analytics, 'uiCardClickedEvent');
        const { findByTestId, analyticsSpy } = await setup();
        jest.runAllTimers();

        await findByTestId('smart-block-title-resolved-view');
        const link = await findByTestId('smart-element-link');

        fireEvent.click(link);

        expect(analytics.uiCardClickedEvent).toHaveBeenCalledTimes(1);
        expect(spy.mock.results[0].value).toEqual({
          action: 'clicked',
          actionSubject: 'smartLink',
          actionSubjectId: 'titleGoToLink',
          attributes: {
            componentName: 'smart-cards',
            definitionId: 'd1',
            display: 'hoverCardPreview',
            extensionKey: 'confluence-object-provider',
            id: expect.any(String),
            isModifierKeyPressed: false,
            packageName: '@atlaskit/smart-card',
            packageVersion: '999.9.9',
            status: 'resolved',
          },
          eventType: 'ui',
        });
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

      it('should fire clicked event when title is middle clicked', async () => {
        const { findByTestId, analyticsSpy } = await setup();
        jest.runAllTimers();

        await findByTestId('smart-block-title-resolved-view');
        const link = await findByTestId('smart-element-link');

        fireEvent.mouseDown(link, { button: 1 });

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
        const { findByTestId, analyticsSpy } = await setup();
        jest.runAllTimers();

        await findByTestId('smart-block-title-resolved-view');
        const link = await findByTestId('smart-element-link');

        fireEvent.mouseDown(link, { button: 2 });

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

      describe('should fire link clicked event with attributes from SmartLinkAnalyticsContext if link is resolved', () => {
        ffTest(
          'platform.linking-platform.smart-card.enable-analytics-context',
          async () => {
            const { findByTestId, analyticsSpy } = await setup({
              extraCardProps: { id: 'some-id' },
            });
            jest.runAllTimers();

            await findByTestId('smart-block-title-resolved-view');
            const link = await findByTestId('smart-element-link');

            fireEvent.click(link);

            expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
              {
                payload: {
                  action: 'clicked',
                  actionSubject: 'link',
                },
                context: [
                  {
                    attributes: {
                      display: 'hoverCardPreview',
                      id: 'some-id',
                    },
                  },
                  {
                    attributes: {
                      status: 'resolved',
                    },
                  },
                ],
              },
              analytics.ANALYTICS_CHANNEL,
            );
          },
          async () => {
            const { findByTestId, analyticsSpy } = await setup({
              extraCardProps: { id: 'some-id' },
            });
            jest.runAllTimers();

            await findByTestId('smart-block-title-resolved-view');
            const link = await findByTestId('smart-element-link');

            fireEvent.click(link);

            expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
              {
                payload: {
                  action: 'clicked',
                  actionSubject: 'link',
                },
              },
              analytics.ANALYTICS_CHANNEL,
            );
            expect(analyticsSpy).not.toBeFiredWithAnalyticEventOnce(
              {
                payload: {
                  action: 'clicked',
                  actionSubject: 'link',
                },
                context: [
                  {
                    attributes: {
                      status: 'resolved',
                    },
                  },
                ],
              },
              analytics.ANALYTICS_CHANNEL,
            );
          },
        );
      });

      it('should fire clicked event when open button is clicked', async () => {
        const spy = jest.spyOn(analytics, 'uiHoverCardOpenLinkClickedEvent');

        const { findByTestId } = await setup();
        jest.runAllTimers();
        // wait for card to be resolved
        await findByTestId('smart-block-title-resolved-view');
        const openButton = await findByTestId('hover-card-open-button');
        fireEvent.click(openButton);

        expect(analytics.uiHoverCardOpenLinkClickedEvent).toHaveBeenCalledTimes(
          1,
        );
        expect(spy.mock.results[0].value).toEqual({
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'shortcutGoToLink',
          attributes: {
            componentName: 'smart-cards',
            definitionId: 'd1',
            id: expect.any(String),
            extensionKey: 'confluence-object-provider',
            packageName: '@atlaskit/smart-card',
            packageVersion: '999.9.9',
            previewDisplay: 'card',
          },
          eventType: 'ui',
        });
      });

      it('should fire clicked event and close event when preview button is clicked', async () => {
        const clickSpy = jest.spyOn(analytics, 'uiActionClickedEvent');
        const closeSpy = jest.spyOn(analytics, 'uiHoverCardDismissedEvent');

        const { findByTestId } = await setup({
          mock: mockBaseResponseWithPreview,
        });
        jest.runAllTimers();

        await findByTestId('smart-block-title-resolved-view');
        const button = await findByTestId('preview-content');

        fireEvent.click(button);

        expect(analytics.uiActionClickedEvent).toHaveBeenCalledTimes(1);
        expect(clickSpy.mock.results[0].value).toEqual({
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'invokePreviewScreen',
          attributes: {
            actionType: 'PreviewAction',
            componentName: 'smart-cards',
            display: 'hoverCardPreview',
            definitionId: 'd1',
            id: expect.any(String),
            extensionKey: 'test-object-provider',
            packageName: '@atlaskit/smart-card',
            packageVersion: '999.9.9',
          },
          eventType: 'ui',
        });
        expect(analytics.uiHoverCardDismissedEvent).toHaveBeenCalledTimes(1);
        expect(closeSpy.mock.results[0].value).toEqual({
          action: 'dismissed',
          actionSubject: 'hoverCard',
          attributes: {
            componentName: 'smart-cards',
            definitionId: 'd1',
            id: expect.any(String),
            extensionKey: 'test-object-provider',
            hoverTime: 0,
            packageName: '@atlaskit/smart-card',
            packageVersion: '999.9.9',
            previewDisplay: 'card',
            previewInvokeMethod: 'mouse_hover',
            status: 'resolved',
          },
          eventType: 'ui',
        });
      });

      it('should fire clicked event when download button is clicked', async () => {
        const spy = jest.spyOn(analytics, 'uiActionClickedEvent');
        const { findByTestId } = await setup({
          mock: mockBaseResponseWithDownload,
        });
        jest.runAllTimers();

        await findByTestId('smart-block-title-resolved-view');
        const button = await findByTestId('download-content');

        fireEvent.click(button);

        expect(analytics.uiActionClickedEvent).toHaveBeenCalledTimes(1);
        expect(spy.mock.results[0].value).toEqual({
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'downloadDocument',
          attributes: {
            actionType: 'DownloadAction',
            componentName: 'smart-cards',
            display: 'hoverCardPreview',
            id: expect.any(String),
            definitionId: 'd1',
            extensionKey: 'test-object-provider',
            packageName: '@atlaskit/smart-card',
            packageVersion: '999.9.9',
          },
          eventType: 'ui',
        });
      });

      it('should fire render failed event when hover card errors during render', async () => {
        const mock = jest.spyOn(analytics, 'uiRenderFailedEvent');
        jest.spyOn(analytics, 'fireSmartLinkEvent');
        jest
          .spyOn(HoverCardComponent, 'HoverCardComponent')
          .mockImplementation(() => {
            throw new Error('something happened');
          });

        //setup function implicitly tests that the inline link resolved view is still in the DOM
        await setup();
        jest.runAllTimers();

        await waitFor(() => expect(analytics.fireSmartLinkEvent).toBeCalled(), {
          timeout: 5000,
        });
        expect(analytics.uiRenderFailedEvent).toHaveBeenCalledTimes(1);
        expect(mock.mock.results[0].value).toEqual({
          action: 'renderFailed',
          actionSubject: 'smartLink',
          attributes: {
            componentName: 'smart-cards',
            error: new Error('something happened'),
            errorInfo: expect.any(Object),
            display: 'hoverCardPreview',
            definitionId: 'd1',
            extensionKey: 'confluence-object-provider',
            id: expect.any(String),
            packageName: '@atlaskit/smart-card',
            packageVersion: '999.9.9',
          },
          eventType: 'ui',
        });
      });
    });

    describe('hover preview feature flag:', () => {
      const setupWithFF = async (providerFF?: boolean, cardFF?: boolean) => {
        mockFetch = jest.fn(() => Promise.resolve(mockConfluenceResponse));
        mockClient = new (fakeFactory(mockFetch))();

        const { queryByTestId, findByTestId } = render(
          <Provider
            client={mockClient}
            featureFlags={{ showHoverPreview: providerFF }}
          >
            <Card appearance="inline" url={mockUrl} showHoverPreview={cardFF} />
          </Provider>,
        );

        const element = await findByTestId('inline-card-resolved-view');
        jest.useFakeTimers();
        fireEvent.mouseEnter(element);
        jest.runAllTimers();
        return { findByTestId, queryByTestId };
      };

      const cases: [
        'should' | 'should not',
        boolean | undefined,
        boolean | undefined,
      ][] = [
        ['should not', undefined, undefined],
        ['should', true, undefined],
        ['should not', false, undefined],
        ['should', undefined, true],
        ['should', true, true],
        ['should', false, true],
        ['should not', undefined, false],
        ['should not', true, false],
        ['should not', false, false],
      ];
      test.each(cases)(
        'hover card %p render when prop is %p on provider and %p on card',
        async (outcome, providerFF, cardFF) => {
          if (outcome === 'should') {
            const { findByTestId } = await setupWithFF(providerFF, cardFF);
            expect(await findByTestId('hover-card')).toBeDefined();
          } else {
            const { queryByTestId } = await setupWithFF(providerFF, cardFF);
            expect(queryByTestId('hover-card')).toBeNull();
          }
        },
      );
    });

    describe('auth tooltip feature flag:', () => {
      const setupWithFF = async (
        providerFF?: 'experiment' | 'control' | 'off',
        cardProp?: boolean,
      ) => {
        mockFetch = jest.fn(() => Promise.resolve(mockUnauthorisedResponse));
        mockClient = new (fakeFactory(mockFetch))();

        const { queryByTestId, findByTestId } = render(
          <Provider
            client={mockClient}
            featureFlags={{ showAuthTooltip: providerFF }}
          >
            <Card
              appearance="inline"
              url={mockUrl}
              showAuthTooltip={cardProp}
            />
          </Provider>,
        );

        const element = await findByTestId('inline-card-unauthorized-view');
        jest.useFakeTimers();
        fireEvent.mouseEnter(element);
        jest.runAllTimers();
        return { findByTestId, queryByTestId };
      };

      const cases: [
        'should' | 'should not',
        'experiment' | 'control' | 'off' | undefined,
        boolean | undefined,
      ][] = [
        ['should not', undefined, undefined],
        ['should', 'experiment', undefined],
        ['should not', 'off', undefined],
        ['should not', 'control', undefined],
        ['should', undefined, true],
        ['should', 'experiment', true],
        ['should not', 'off', true],
        ['should not', 'control', true],
        ['should not', undefined, false],
        ['should', 'experiment', false],
        ['should not', 'off', false],
        ['should not', 'control', false],
      ];
      test.each(cases)(
        'auth tooltip %p render when feature flag is %p on provider and prop is %p on card',
        async (outcome, providerFF, cardProp) => {
          if (outcome === 'should') {
            const { findByTestId } = await setupWithFF(providerFF, cardProp);
            expect(
              await findByTestId('hover-card-unauthorised-view'),
            ).toBeDefined();
          } else {
            const { queryByTestId } = await setupWithFF(providerFF, cardProp);
            expect(queryByTestId('hover-card-unauthorised-view')).toBeNull();
          }
        },
      );
    });

    it('does not propagate event to parent when clicking inside hover card content', async () => {
      const containerOnClick = jest.fn();
      mockFetch = jest.fn(() => Promise.resolve(mockConfluenceResponse));
      mockClient = new (fakeFactory(mockFetch))();

      const { findByTestId } = render(
        <div onClick={containerOnClick}>
          <Provider client={mockClient}>
            <Card
              appearance="inline"
              url="https://some.url"
              showHoverPreview={true}
            />
          </Provider>
        </div>,
      );

      const element = await findByTestId('inline-card-resolved-view');
      jest.useFakeTimers();
      fireEvent.mouseEnter(element);
      jest.runAllTimers();

      const content = await findByTestId('smart-links-container');
      fireEvent.click(content);

      const link = await findByTestId('smart-element-link');
      fireEvent.click(link);

      const previewButton = await findByTestId('preview-content');
      fireEvent.click(previewButton);

      expect(containerOnClick).not.toHaveBeenCalled();
    });

    it('does not propagate event to parent when clicking inside hover card content on a flexui link', async () => {
      const containerOnClick = jest.fn();
      mockFetch = jest.fn(() => Promise.resolve(mockConfluenceResponse));
      mockClient = new (fakeFactory(mockFetch))();

      const { findByTestId } = render(
        <div onClick={containerOnClick}>
          <Provider client={mockClient}>
            <Card
              appearance="block"
              showHoverPreview={true}
              url="https://some.url"
            >
              <TitleBlock />
            </Card>
          </Provider>
        </div>,
      );

      const element = await findByTestId('smart-links-container');
      jest.useFakeTimers();
      fireEvent.mouseEnter(element);
      jest.runAllTimers();

      const metadataBlock = await findByTestId(
        'smart-block-metadata-resolved-view',
      );
      fireEvent.click(metadataBlock);

      const previewButton = await findByTestId(
        'smart-footer-block-resolved-view',
      );
      fireEvent.click(previewButton);

      expect(containerOnClick).not.toHaveBeenCalled();
    });

    describe('SSR links', () => {
      const setupWithSSR = async () => {
        let resolveFetch = (value: unknown) => {};
        let rejectFetch = (reason: any) => {};
        const mockPromise = new Promise((resolve, reject) => {
          resolveFetch = resolve;
          rejectFetch = reject;
        });
        mockFetch = jest.fn(() => mockPromise);
        mockClient = new (fakeFactory(mockFetch))();
        const storeOptions: any = {
          initialState: {
            [mockUrl]: {
              status: 'resolved',
              details: mockSSRResponse,
            },
          },
        };

        const { findByTestId, queryByTestId } = render(
          <Provider client={mockClient} storeOptions={storeOptions}>
            <Card appearance="inline" url={mockUrl} showHoverPreview={true} />
          </Provider>,
        );

        expect(mockFetch).toBeCalledTimes(0);
        const element = await findByTestId('inline-card-resolved-view');
        expect(element.textContent).toBe('I am a fan of cheese');

        jest.useFakeTimers();
        fireEvent.mouseEnter(element);
        jest.runAllTimers();
        await waitFor(() => expect(mockFetch).toBeCalledTimes(1));

        return { findByTestId, queryByTestId, resolveFetch, rejectFetch };
      };

      it('should render hover card correctly', async () => {
        const { findByTestId, queryByTestId, resolveFetch } =
          await setupWithSSR();

        await findByTestId('hover-card-loading-view');
        resolveFetch(mockConfluenceResponse);
        jest.runAllTimers();

        await findByTestId('smart-block-metadata-resolved-view');
        const titleBlock = await findByTestId(
          'smart-block-title-resolved-view',
        );
        const snippetBlock = await findByTestId(
          'smart-block-snippet-resolved-view',
        );
        const footerBlock = await findByTestId(
          'smart-footer-block-resolved-view',
        );
        expect(queryByTestId('hover-card-loading-view')).toBeNull();

        //trim because the icons are causing new lines in the textContent
        expect(titleBlock.textContent?.trim()).toBe('I love cheese');
        expect(snippetBlock.textContent).toBe('Here is your serving of cheese');
        expect(footerBlock.textContent?.trim()).toBe(
          'ConfluenceCommentFull screen view',
        );
      });

      it('should fall back to default path if fetch fails', async () => {
        const { rejectFetch, queryByTestId, findByTestId } =
          await setupWithSSR();

        await findByTestId('hover-card-loading-view');
        rejectFetch('error');

        const titleBlock = await findByTestId(
          'smart-block-title-resolved-view',
        );
        const snippetBlock = await findByTestId(
          'smart-block-snippet-resolved-view',
        );
        const footerBlock = await findByTestId(
          'smart-footer-block-resolved-view',
        );
        expect(queryByTestId('hover-card-loading-view')).toBeNull();

        //trim because the icons are causing new lines in the textContent
        expect(titleBlock.textContent?.trim()).toBe('I am a fan of cheese');
        expect(snippetBlock.textContent).toBe('');
        expect(footerBlock.textContent?.trim()).toBe('');
      });
    });

    describe('Unauthorized Hover Card', () => {
      it('renders Unauthorised hover card', async () => {
        const { findByTestId } = await setup({
          mock: mockUnauthorisedResponse,
          featureFlags: { showAuthTooltip: 'experiment' },
          testId: 'inline-card-unauthorized-view',
        });
        jest.runAllTimers();
        const unauthorisedHoverCard = await findByTestId(
          'hover-card-unauthorised-view',
        );

        expect(unauthorisedHoverCard).toBeTruthy();
      });

      it('should fire viewed event when hover card is opened', async () => {
        const mock = jest.spyOn(analytics, 'uiHoverCardViewedEvent');

        const { findByTestId } = await setup({
          mock: mockUnauthorisedResponse,
          featureFlags: { showAuthTooltip: 'experiment' },
          testId: 'inline-card-unauthorized-view',
        });
        jest.runAllTimers();

        //wait for card to be resolved
        await findByTestId('hover-card-unauthorised-view');
        expect(analytics.uiHoverCardViewedEvent).toHaveBeenCalledTimes(1);
        expect(mock.mock.results[0].value).toEqual({
          action: 'viewed',
          actionSubject: 'hoverCard',
          attributes: {
            componentName: 'smart-cards',
            definitionId: '440fdd47-25ac-4ac2-851f-1b7526365ade',
            id: expect.any(String),
            packageName: '@atlaskit/smart-card',
            packageVersion: '999.9.9',
            previewDisplay: 'card',
            previewInvokeMethod: 'mouse_hover',
            status: 'unauthorized',
            extensionKey: 'google-object-provider',
            resourceType: 'file',
            destinationObjectType: 'file',
          },
          eventType: 'ui',
        });
      });

      it('should fire dismissed event when hover card is opened then closed', async () => {
        const mock = jest.spyOn(analytics, 'uiHoverCardDismissedEvent');

        const { queryByTestId, findByTestId, element } = await setup({
          mock: mockUnauthorisedResponse,
          featureFlags: { showAuthTooltip: 'experiment' },
          testId: 'inline-card-unauthorized-view',
        });
        jest.runAllTimers();
        // wait for card to be resolved
        await findByTestId('hover-card-unauthorised-view');
        fireEvent.mouseLeave(element);
        jest.runAllTimers();
        expect(queryByTestId('hover-card')).toBeNull();

        expect(analytics.uiHoverCardDismissedEvent).toHaveBeenCalledTimes(1);
        expect(mock.mock.results[0].value).toEqual({
          action: 'dismissed',
          actionSubject: 'hoverCard',
          attributes: {
            componentName: 'smart-cards',
            definitionId: '440fdd47-25ac-4ac2-851f-1b7526365ade',
            id: expect.any(String),
            extensionKey: 'google-object-provider',
            hoverTime: 0,
            packageName: '@atlaskit/smart-card',
            packageVersion: '999.9.9',
            previewDisplay: 'card',
            previewInvokeMethod: 'mouse_hover',
            status: 'unauthorized',
            resourceType: 'file',
            destinationObjectType: 'file',
          },
          eventType: 'ui',
        });
      });

      describe('should fire link clicked event when resolved hover card is clicked', () => {
        ffTest(
          'platform.linking-platform.smart-card.enable-analytics-context',
          async () => {
            const testId = 'hover-test-div';
            const hoverCardComponent = (
              <HoverCard url={mockUrl} id="some-id">
                <div data-testid={testId}>Hover on me</div>
              </HoverCard>
            );
            const { findByTestId, analyticsSpy } = await setup({
              testId,
              component: hoverCardComponent,
            });
            await findByTestId('smart-block-metadata-resolved-view');
            const link = await findByTestId('smart-element-link');

            fireEvent.click(link);

            expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
              {
                payload: {
                  action: 'clicked',
                  actionSubject: 'link',
                },
                context: [
                  {
                    attributes: {
                      display: 'hoverCardPreview',
                      id: 'some-id',
                    },
                  },
                  {
                    attributes: {
                      displayCategory: 'smartLink',
                      status: 'resolved',
                    },
                  },
                ],
              },
              analytics.ANALYTICS_CHANNEL,
            );
          },
          async () => {
            const testId = 'hover-test-div';
            const hoverCardComponent = (
              <HoverCard url={mockUrl} id="some-id">
                <div data-testid={testId}>Hover on me</div>
              </HoverCard>
            );
            const { findByTestId, analyticsSpy } = await setup({
              testId,
              component: hoverCardComponent,
            });
            await findByTestId('smart-block-metadata-resolved-view');
            const link = await findByTestId('smart-element-link');

            fireEvent.click(link);

            expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
              {
                payload: {
                  action: 'clicked',
                  actionSubject: 'link',
                },
              },
              analytics.ANALYTICS_CHANNEL,
            );
            expect(analyticsSpy).not.toBeFiredWithAnalyticEventOnce(
              {
                payload: {
                  action: 'clicked',
                  actionSubject: 'link',
                },
                context: [
                  {
                    attributes: {
                      status: 'resolved',
                    },
                  },
                ],
              },
              analytics.ANALYTICS_CHANNEL,
            );
          },
        );
      });
    });

    describe('server actions', () => {
      const mock = mockJiraResponse;

      describe('inline smart link', () => {
        const setupWithInline = (showServerActions?: boolean) =>
          setup({
            extraCardProps: { showServerActions },
            mock,
          });

        serverActionsTest(setupWithInline);
      });

      describe('flexible smart link', () => {
        const setupWithFlexible = (showServerActions?: boolean) =>
          setup({
            extraCardProps: {
              appearance: 'block',
              showServerActions,
              children: <TitleBlock />,
            },
            mock,
            testId: 'hover-card-trigger-wrapper',
          });

        serverActionsTest(setupWithFlexible);
      });
    });
  });

  describe('standalone hover card', () => {
    it('should render a hover card over a div', async () => {
      const testId = 'hover-test-div';
      const hoverCardComponent = (
        <HoverCard url={mockUrl}>
          <div data-testid={testId}>Hover on me</div>
        </HoverCard>
      );
      const { findByTestId } = await setup({
        testId,
        component: hoverCardComponent,
      });
      jest.runAllTimers();
      const titleBlock = await findByTestId('smart-block-title-resolved-view');
      await findByTestId('smart-block-metadata-resolved-view');
      const snippetBlock = await findByTestId(
        'smart-block-snippet-resolved-view',
      );
      const footerBlock = await findByTestId(
        'smart-footer-block-resolved-view',
      );
      //trim because the icons are causing new lines in the textContent
      expect(titleBlock.textContent?.trim()).toBe('I love cheese');
      expect(snippetBlock.textContent).toBe('Here is your serving of cheese');
      expect(footerBlock.textContent?.trim()).toBe(
        'ConfluenceCommentFull screen view',
      );
    });

    it('should not show the full screen view action if disabled via prop', async () => {
      const testId = 'hover-test-div';
      const hoverCardComponent = (
        <HoverCard url={mockUrl} hidePreviewButton={true}>
          <div data-testid={testId}>Hover on me</div>
        </HoverCard>
      );
      const { findByTestId, queryByTestId } = await setup({
        testId,
        component: hoverCardComponent,
      });
      jest.runAllTimers();
      const footerBlock = await findByTestId(
        'smart-footer-block-resolved-view',
      );
      expect(footerBlock).toBeTruthy();
      const fullscreenButton = queryByTestId('preview-content-button-wrapper');
      expect(fullscreenButton).toBeFalsy();
    });

    describe('link clicked', () => {
      const testId = 'hover-test-div';
      const mockFetch = jest.fn(() => Promise.resolve(mockConfluenceResponse));
      const mockClient = new (fakeFactory(mockFetch))();

      const hoverCardComponent = (
        <Provider client={mockClient}>
          <HoverCard url={mockUrl} id="some-id">
            <div data-testid={testId}>Hover on me</div>
          </HoverCard>
        </Provider>
      );

      ffTest(
        'platform.linking-platform.smart-card.enable-analytics-context',
        (ff) => {
          ffTest(
            'platform.linking-platform.smart-card.refactor-hover-card-analytics',
            async () => {
              const spy = jest.spyOn(analytics, 'uiCardClickedEvent');
              const { findByTestId, analyticsSpy } = await setup({
                testId,
                component: hoverCardComponent,
              });

              act(() => {
                jest.runAllTimers();
              });

              await findByTestId('smart-block-metadata-resolved-view');

              const link = await findByTestId('smart-element-link');
              fireEvent.click(link);

              expect(analytics.uiCardClickedEvent).toHaveBeenCalledTimes(1);
              expect(spy.mock.results[0].value).toEqual({
                action: 'clicked',
                actionSubject: 'smartLink',
                actionSubjectId: 'titleGoToLink',
                attributes: {
                  componentName: 'smart-cards',
                  definitionId: 'd1',
                  extensionKey: 'confluence-object-provider',
                  display: 'hoverCardPreview',
                  id: expect.any(String),
                  isModifierKeyPressed: false,
                  packageName: '@atlaskit/smart-card',
                  packageVersion: '999.9.9',
                  status: 'resolved',
                },
                eventType: 'ui',
              });

              expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
                {
                  context: [
                    {
                      attributes: {
                        display: 'hoverCardPreview',
                        id: 'some-id',
                      },
                    },
                    {
                      attributes: {
                        status: 'resolved',
                      },
                    },
                  ],
                  payload: {
                    action: 'clicked',
                    actionSubject: 'smartLink',
                  },
                },
                analytics.ANALYTICS_CHANNEL,
              );
              expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
                {
                  context: [
                    {
                      attributes: {
                        display: 'hoverCardPreview',
                        id: 'some-id',
                      },
                      source: 'smartLinkPreviewHoverCard',
                    },
                    {
                      attributes: {
                        status: 'resolved',
                      },
                    },
                  ],
                  payload: {
                    action: 'clicked',
                    actionSubject: 'link',
                  },
                },
                analytics.ANALYTICS_CHANNEL,
              );
            },
            async () => {
              const spy = jest.spyOn(analytics, 'uiCardClickedEvent');
              const { findByTestId, analyticsSpy } = await setup({
                testId,
                component: hoverCardComponent,
              });

              await findByTestId('smart-block-metadata-resolved-view');

              const link = await findByTestId('smart-element-link');
              fireEvent.click(link);

              expect(analytics.uiCardClickedEvent).toHaveBeenCalledTimes(1);
              expect(spy.mock.results[0].value).toEqual({
                action: 'clicked',
                actionSubject: 'smartLink',
                actionSubjectId: 'titleGoToLink',
                attributes: {
                  componentName: 'smart-cards',
                  /**
                   * packages/linking-platform/smart-card/src/state/analytics/useSmartLinkAnalytics.ts
                   * these attributes below missing because useSmartLinkAnalytics does not react to loading in url data
                   */
                  // definitionId: 'd1',
                  // extensionKey: 'confluence-object-provider',
                  display: 'hoverCardPreview',
                  id: expect.any(String),
                  isModifierKeyPressed: false,
                  packageName: '@atlaskit/smart-card',
                  packageVersion: '999.9.9',
                  status: 'resolved',
                },
                eventType: 'ui',
              });

              expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
                {
                  context: [
                    {
                      attributes: {
                        display: 'hoverCardPreview',
                        id: 'some-id',
                      },
                    },
                    {
                      attributes: {
                        status: 'resolved',
                      },
                    },
                  ],
                  payload: {
                    action: 'clicked',
                    actionSubject: 'link',
                  },
                },
                analytics.ANALYTICS_CHANNEL,
              );
            },
            ff,
          );
        },
        async () => {
          const spy = jest.spyOn(analytics, 'uiCardClickedEvent');
          const { findByTestId, analyticsSpy } = await setup({
            testId,
            component: hoverCardComponent,
          });

          await findByTestId('smart-block-metadata-resolved-view');

          const link = await findByTestId('smart-element-link');
          fireEvent.click(link);

          expect(analytics.uiCardClickedEvent).toHaveBeenCalledTimes(1);
          expect(spy.mock.results[0].value).toEqual({
            action: 'clicked',
            actionSubject: 'smartLink',
            actionSubjectId: 'titleGoToLink',
            attributes: {
              componentName: 'smart-cards',
              /**
               * packages/linking-platform/smart-card/src/state/analytics/useSmartLinkAnalytics.ts
               * these attributes below missing because useSmartLinkAnalytics does not react to loading in url data
               */
              // definitionId: 'd1',
              // extensionKey: 'confluence-object-provider',
              display: 'hoverCardPreview',
              id: expect.any(String),
              isModifierKeyPressed: false,
              packageName: '@atlaskit/smart-card',
              packageVersion: '999.9.9',
              status: 'resolved',
            },
            eventType: 'ui',
          });

          expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
            {
              context: [],
              payload: {
                action: 'clicked',
                actionSubject: 'link',
              },
            },
            analytics.ANALYTICS_CHANNEL,
          );
        },
      );
    });

    describe('analytics context', () => {
      const testId = 'hover-card-trigger-wrapper';
      const channel = 'media';

      const DummyComponent = () => {
        const { createAnalyticsEvent } = useAnalyticsEvents();
        useEffect(() => {
          createAnalyticsEvent({
            action: 'fired',
            actionSubject: 'event',
          }).fire(channel);
        }, [createAnalyticsEvent]);

        return null;
      };

      const component = (
        <HoverCard url={mockUrl} id="some-id">
          <DummyComponent />
        </HoverCard>
      );

      ffTest(
        'platform.linking-platform.smart-card.enable-analytics-context',
        (ff) => {
          ffTest(
            'platform.linking-platform.smart-card.refactor-hover-card-analytics',
            async () => {
              const { analyticsSpy } = await setup({
                testId,
                component,
              });

              act(() => {
                jest.runAllTimers();
              });

              expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
                payload: {
                  action: 'fired',
                  actionSubject: 'event',
                },
                // Wrapped component SHOULD NOT have context (disabled by enable-analytics-context)
                context: [],
              });

              expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
                payload: {
                  action: 'viewed',
                  actionSubject: 'hoverCard',
                  attributes: {
                    previewDisplay: 'card',
                    previewInvokeMethod: 'mouse_hover',
                    status: 'pending',
                  },
                },
                context: [
                  {
                    attributes: {
                      display: 'hoverCardPreview',
                    },
                    source: 'smartLinkPreviewHoverCard',
                  },
                ],
              });
            },
            async () => {
              const { analyticsSpy } = await setup({
                testId,
                component,
              });

              act(() => {
                jest.runAllTimers();
              });

              expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
                payload: {
                  action: 'fired',
                  actionSubject: 'event',
                },
                // Wrapped component SHOULD have context (present unless enable-analytics-context)
                context: [
                  {
                    attributes: {
                      display: 'hoverCardPreview',
                    },
                    source: 'smartLinkPreviewHoverCard',
                  },
                ],
              });

              expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
                payload: {
                  action: 'viewed',
                  actionSubject: 'hoverCard',
                  attributes: {
                    previewDisplay: 'card',
                    previewInvokeMethod: 'mouse_hover',
                    status: 'pending',
                  },
                },
                context: [],
              });
            },
            ff,
          );
        },
        async () => {
          const { analyticsSpy } = await setup({
            testId,
            component,
          });

          jest.runAllTimers();

          expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
            payload: {
              action: 'fired',
              actionSubject: 'event',
            },
            context: [
              {
                attributes: {
                  display: 'hoverCardPreview',
                },
                source: 'smartLinkPreviewHoverCard',
              },
            ],
          });
          expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
            payload: {
              action: 'viewed',
              actionSubject: 'hoverCard',
              attributes: {
                previewDisplay: 'card',
                previewInvokeMethod: 'mouse_hover',
                status: 'pending',
              },
            },
            context: [
              {
                attributes: {
                  display: 'hoverCardPreview',
                },
                source: 'smartLinkPreviewHoverCard',
              },
            ],
          });
        },
      );
    });

    describe('server actions', () => {
      const setupWithStandalone = (showServerActions?: boolean) => {
        const testId = 'hover-test-div';
        const component = (
          <HoverCard showServerActions={showServerActions} url={mockUrl}>
            <div data-testid={testId}>Hover on me</div>
          </HoverCard>
        );

        return setup({
          component,
          mock: mockJiraResponse,
          testId,
        });
      };

      serverActionsTest(setupWithStandalone);
    });
  });
});
