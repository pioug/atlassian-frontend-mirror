import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { IntlProvider } from 'react-intl-next';
import { render, screen } from '@testing-library/react';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { useSmartLinkAnalytics } from '../../../../../../';
import {
  CONTENT_URL_3P_ACCOUNT_AUTH,
  CONTENT_URL_SECURITY_AND_PERMISSIONS,
} from '../../../../../../constants';
import { AnalyticsFacade } from '../../../../../../state/analytics';
import HoverCardUnauthorisedView from '../index';
import { HoverCardUnauthorisedProps } from '../types';
import { getCardState } from '../../../../../../../examples/utils/flexible-ui';
import { mockGetContext } from '../../../../../../state/actions/__tests__/index.test.mock';
import { mocks } from '../../../../../../utils/mocks';
import { mockUnauthorisedResponse } from '../../../../__tests__/__mocks__/mocks';

mockSimpleIntersectionObserver();

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
  useFeatureFlag: jest.fn(),
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

  const setUpHoverCard = (
    propOverrides?: Partial<HoverCardUnauthorisedProps>,
  ) => {
    render(
      <IntlProvider locale="en">
        <HoverCardUnauthorisedView
          analytics={analyticsEvents}
          url={mockUrl}
          extensionKey={'google-object-provider'}
          id={'123'}
          flexibleCardProps={{
            cardState: getCardState({
              data: { ...mockUnauthorisedResponse.data, url: mockUrl },
              meta: mockUnauthorisedResponse.meta,
              status: 'unauthorized',
            }),
            children: {},
            url: mockUrl,
          }}
          {...propOverrides}
        />
      </IntlProvider>,
    );
  };

  it('renders Unauthorised hover card content', () => {
    setUpHoverCard();
    const iconElement = screen.getByTestId('smart-element-icon');
    const titleElement = screen.getByTestId(
      'hover-card-unauthorised-view-title',
    );
    const mainContentElement = screen.getByTestId(
      'hover-card-unauthorised-view-content',
    );
    const buttonElement = screen.getByTestId(
      'hover-card-unauthorised-view-button',
    );

    expect(iconElement).toBeTruthy();
    expect(titleElement.textContent).toBe('Connect your Google account');
    expect(mainContentElement.textContent).toBe(
      'Connect your Google account to collaborate on work across Atlassian products. Learn more about Smart Links.',
    );
    expect(buttonElement.textContent).toBe('Connect to Google');
  });

  it('"learn more" link should have a correct url', () => {
    setUpHoverCard();

    const learnMoreLink = screen.getByRole('link', { name: /learn more/i });
    expect(learnMoreLink.getAttribute('href')).toBe(
      CONTENT_URL_SECURITY_AND_PERMISSIONS,
    );
  });

  it('renders alternative message when `hasScopeOverrides` flag is present in the meta', () => {
    setUpHoverCard({
      flexibleCardProps: {
        cardState: getCardState({
          data: { ...mockUnauthorisedResponse.data, url: mockUrl },
          meta: { hasScopeOverrides: true, ...mockUnauthorisedResponse.meta },
          status: 'unauthorized',
        }),
        children: {},
        url: mockUrl,
      },
    });
    const iconElement = screen.getByTestId('smart-element-icon');
    const titleElement = screen.getByTestId(
      'hover-card-unauthorised-view-title',
    );
    const mainContentElement = screen.getByTestId(
      'hover-card-unauthorised-view-content',
    );
    const buttonElement = screen.getByTestId(
      'hover-card-unauthorised-view-button',
    );

    expect(iconElement).toBeTruthy();
    expect(titleElement.textContent).toBe('Connect your Google account');
    expect(mainContentElement.textContent).toBe(
      'Connect your Google account to collaborate on work across Atlassian products. Learn more about connecting your account to Atlassian products.',
    );
    expect(buttonElement.textContent).toBe('Connect to Google');
  });

  it('uses alternative "learn more" url when `hasScopeOverrides` flag is present in the meta', () => {
    setUpHoverCard({
      flexibleCardProps: {
        cardState: getCardState({
          data: { ...mockUnauthorisedResponse.data, url: mockUrl },
          meta: { hasScopeOverrides: true, ...mockUnauthorisedResponse.meta },
          status: 'unauthorized',
        }),
        children: {},
        url: mockUrl,
      },
    });

    const learnMoreLink = screen.getByRole('link', { name: /learn more/i });
    expect(learnMoreLink.getAttribute('href')).toBe(
      CONTENT_URL_3P_ACCOUNT_AUTH,
    );
  });
});
