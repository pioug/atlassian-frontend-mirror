import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import '../../../../../__mocks__/intersection-observer.mock';
import { IntlProvider } from 'react-intl-next';
import { render } from '@testing-library/react';
import { useSmartLinkAnalytics } from '../../../../../../';
import { AnalyticsFacade } from '../../../../../../state/analytics';
import HoverCardUnauthorisedView from '../index';
import { getCardState } from '../../../../../../../examples/utils/flexible-ui';
import { mockGetContext } from '../../../../../../state/actions/__tests__/index.test.mock';
import { mocks } from '../../../../../../utils/mocks';
import { mockUnauthorisedResponse } from '../../../../__tests__/__mocks__/mocks';

jest.mock('@atlaskit/link-provider', () => ({
  useSmartLinkContext: () => ({
    ...mockGetContext(),
    store: {
      getState: () => ({ 'test-url': mocks.analytics }),
      dispatch: jest.fn(),
    },
    connections: {
      client: {
        fetchData: jest.fn(() => Promise.resolve(mockUnauthorisedResponse)),
      },
    },
    config: {
      authFlow: 'disabled',
    },
  }),
}));

describe('Unauthorised Hover Card', () => {
  let mockUrl: string;

  const id = 'unauthorized-test-id';
  const location = 'unauthorized-test-location';
  const dispatchAnalytics = jest.fn();
  let analyticsEvents: AnalyticsFacade;

  beforeEach(() => {
    const { result } = renderHook(() =>
      useSmartLinkAnalytics('test-url', dispatchAnalytics, id, location),
    );
    analyticsEvents = result.current;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setUpHoverCard = async () => {
    const { queryByTestId, findByTestId, debug } = render(
      <IntlProvider locale="en">
        <HoverCardUnauthorisedView
          analytics={analyticsEvents}
          url={mockUrl}
          extensionKey={'google-object-provider'}
          id={'123'}
          flexibleCardProps={{
            cardState: getCardState(
              { ...mockUnauthorisedResponse.data, url: mockUrl },
              mockUnauthorisedResponse.meta,
              'unauthorized',
            ),
            children: {},
            url: mockUrl,
          }}
        />
      </IntlProvider>,
    );

    return { queryByTestId, findByTestId, debug };
  };

  it('renders Unauthorised hover card content', async () => {
    const { findByTestId } = await setUpHoverCard();
    jest.runAllTimers();
    const iconElement = await findByTestId('smart-element-icon');
    const titleElement = await findByTestId(
      'hover-card-unauthorised-view-title',
    );
    const mainContentElement = await findByTestId(
      'hover-card-unauthorised-view-content',
    );
    const buttonElement = await findByTestId(
      'hover-card-unauthorised-view-button',
    );

    expect(iconElement).toBeTruthy();
    expect(titleElement.textContent).toBe('Connect your Google account');
    expect(mainContentElement.textContent).toBe(
      'Connect Google to Atlassian to view more details from your work and collaboration from one place. Learn more about Smart Links.',
    );
    expect(buttonElement.textContent).toBe('Connect to Google');
  });

  it('"learn more" link should have a correct url', async () => {
    const { findByTestId } = await setUpHoverCard();
    jest.runAllTimers();

    const learnMoreLink = await findByTestId(
      'unauthorised-view-content-learn-more',
    );
    expect(learnMoreLink.getAttribute('href')).toBe(
      'https://support.atlassian.com/confluence-cloud/docs/insert-links-and-anchors/#Smart-links',
    );
  });
});
