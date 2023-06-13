import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { CardClient } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import '@atlaskit/link-test-helpers/jest';
import { render } from '@testing-library/react';
import { Card } from '../../Card';
import { Provider } from '../../..';
import { ANALYTICS_CHANNEL } from '../../../utils/analytics';
import { fakeFactory, mocks } from '../../../utils/mocks';
import { TitleBlock } from '../../FlexibleCard/components/blocks';

mockSimpleIntersectionObserver();

/**
 * Test for analytics context with and without feature flags:
 * - platform.linking-platform.smart-card.enable-analytics-context
 * - platform.linking-platform.smart-card.remove-dispatch-analytics-as-prop
 * Remove this file on feature flag cleanup
 */
describe('smartLink renderSuccess event with `enable context` and `remove dispatch as prop` feature flags', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockPostData: jest.Mock;
  let mockWindowOpen: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn(async () => mocks.success);
    mockPostData = jest.fn(async () => mocks.actionSuccess);
    mockClient = new (fakeFactory(mockFetch, mockPostData))();
    mockWindowOpen = jest.fn();
    global.open = mockWindowOpen;
  });

  const mockUrl = 'https://some.url';

  ffTest(
    'platform.linking-platform.smart-card.enable-analytics-context',
    (ff) => {
      ffTest(
        'platform.linking-platform.smart-card.remove-dispatch-analytics-as-prop',
        async () => {
          const analyticsSpy = jest.fn();
          const component = (
            <AnalyticsListener
              onEvent={analyticsSpy}
              channel={ANALYTICS_CHANNEL}
            >
              <IntlProvider locale="en">
                <Provider client={mockClient}>
                  <Card
                    id="some-id"
                    testId="resolvedCard1"
                    appearance="inline"
                    url={mockUrl}
                  />
                </Provider>
              </IntlProvider>
            </AnalyticsListener>
          );
          const { findByTestId } = render(component);

          await findByTestId('resolvedCard1-resolved-view');

          expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
            {
              payload: {
                action: 'renderSuccess',
                actionSubject: 'smartLink',
              },
              context: [
                {
                  componentName: 'smart-cards',
                },
                {
                  attributes: {
                    display: 'inline',
                    id: 'some-id',
                  },
                },
                // additional context from <SmartLinkAnalyticsContext /> wrapper
                {
                  attributes: {
                    status: 'resolved',
                  },
                },
              ],
            },
            ANALYTICS_CHANNEL,
          );
        },
        async () => {
          const analyticsSpy = jest.fn();
          const { findByTestId } = render(
            <AnalyticsListener
              onEvent={analyticsSpy}
              channel={ANALYTICS_CHANNEL}
            >
              <IntlProvider locale="en">
                <Provider client={mockClient}>
                  <Card
                    testId="resolvedCard1"
                    appearance="inline"
                    url="https://atlassian.com"
                  />
                </Provider>
              </IntlProvider>
            </AnalyticsListener>,
          );

          await findByTestId('resolvedCard1-resolved-view');

          expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
            {
              payload: {
                action: 'renderSuccess',
                actionSubject: 'smartLink',
              },
              context: [
                {
                  componentName: 'smart-cards',
                },
                // does NOT have additional context due to prop-drilled dispatch handler
              ],
            },
            ANALYTICS_CHANNEL,
          );
        },
        ff,
      );
    },
    async () => {
      const analyticsSpy = jest.fn();
      const { findByTestId } = render(
        <AnalyticsListener onEvent={analyticsSpy} channel={ANALYTICS_CHANNEL}>
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card
                testId="resolvedCard1"
                appearance="inline"
                url="https://atlassian.com"
              />
            </Provider>
          </IntlProvider>
        </AnalyticsListener>,
      );

      await findByTestId('resolvedCard1-resolved-view');

      // No context wrapper so no resolved attributes
      expect(analyticsSpy).not.toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            action: 'renderSuccess',
            actionSubject: 'smartLink',
          },
          context: [
            {
              attributes: {
                status: 'resolved',
              },
            },
          ],
        },
        ANALYTICS_CHANNEL,
      );
    },
  );
});

describe('smartLink renderSuccess event for flexible UI with `enable context` and `remove dispatch as prop` feature flags', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockPostData: jest.Mock;
  let mockWindowOpen: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn(async () => mocks.success);
    mockPostData = jest.fn(async () => mocks.actionSuccess);
    mockClient = new (fakeFactory(mockFetch, mockPostData))();
    mockWindowOpen = jest.fn();
    global.open = mockWindowOpen;
  });

  const mockUrl = 'https://some.url';

  ffTest(
    'platform.linking-platform.smart-card.enable-analytics-context',
    (ff) => {
      ffTest(
        'platform.linking-platform.smart-card.remove-dispatch-analytics-as-prop',
        async () => {
          const analyticsSpy = jest.fn();
          const component = (
            <AnalyticsListener
              onEvent={analyticsSpy}
              channel={ANALYTICS_CHANNEL}
            >
              <IntlProvider locale="en">
                <Provider client={mockClient}>
                  <Card
                    id="some-id"
                    testId="resolvedCard1"
                    appearance="inline"
                    url={mockUrl}
                  >
                    <TitleBlock />
                  </Card>
                </Provider>
              </IntlProvider>
            </AnalyticsListener>
          );
          const { findByTestId } = render(component);

          await findByTestId('smart-block-title-resolved-view');

          expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
            {
              payload: {
                action: 'renderSuccess',
                actionSubject: 'smartLink',
                attributes: {
                  display: 'inline',
                },
              },
              context: [
                {
                  componentName: 'smart-cards',
                },
                {
                  attributes: {
                    display: 'flexible',
                    id: 'some-id',
                  },
                },
                // additional context from <SmartLinkAnalyticsContext /> wrapper
                {
                  attributes: {
                    status: 'resolved',
                  },
                },
              ],
            },
            ANALYTICS_CHANNEL,
          );
        },
        async () => {
          const analyticsSpy = jest.fn();
          const { findByTestId } = render(
            <AnalyticsListener
              onEvent={analyticsSpy}
              channel={ANALYTICS_CHANNEL}
            >
              <IntlProvider locale="en">
                <Provider client={mockClient}>
                  <Card
                    testId="resolvedCard1"
                    appearance="inline"
                    url="https://atlassian.com"
                  >
                    <TitleBlock />
                  </Card>
                </Provider>
              </IntlProvider>
            </AnalyticsListener>,
          );

          await findByTestId('smart-block-title-resolved-view');

          expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
            {
              payload: {
                action: 'renderSuccess',
                actionSubject: 'smartLink',
                attributes: {
                  display: 'inline',
                },
              },
              context: [
                {
                  componentName: 'smart-cards',
                },
                // does NOT have additional context due to prop-drilled dispatch handler
              ],
            },
            ANALYTICS_CHANNEL,
          );
        },
        ff,
      );
    },
    async () => {
      const analyticsSpy = jest.fn();
      const { findByTestId } = render(
        <AnalyticsListener onEvent={analyticsSpy} channel={ANALYTICS_CHANNEL}>
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card
                testId="resolvedCard1"
                appearance="inline"
                url="https://atlassian.com"
              >
                <TitleBlock />
              </Card>
            </Provider>
          </IntlProvider>
        </AnalyticsListener>,
      );

      await findByTestId('smart-block-title-resolved-view');

      // No context wrapper so no resolved attributes
      expect(analyticsSpy).not.toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            action: 'renderSuccess',
            actionSubject: 'smartLink',
            attributes: {
              display: 'inline',
            },
          },
          context: [
            {
              componentName: 'smart-cards',
            },
            {
              attributes: {
                status: 'resolved',
              },
            },
          ],
        },
        ANALYTICS_CHANNEL,
      );
    },
  );
});
