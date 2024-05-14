import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render } from '@testing-library/react';
import { getMockForbiddenDirectAccessResponse } from '../../../../__tests__/__mocks__/mocks';
import HoverCardForbiddenView from '../index';
import '@atlaskit/link-test-helpers/jest';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import * as analytics from '../../../../../../utils/analytics';
import userEvent from '@testing-library/user-event';
import { SmartCardProvider } from '@atlaskit/link-provider';

const mockResponse = getMockForbiddenDirectAccessResponse();
const forbiddenViewTestId = 'hover-card-forbidden-view-resolved-view';

describe('Forbidden Hover Card', () => {
  const mockUrl = 'https://mock-url.com';

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setUpHoverCard = async (customResponse: any = mockResponse) => {
    const user = userEvent.setup();

    const analyticsSpy = jest.fn();

    const { findByTestId, queryByTestId } = render(
      <AnalyticsListener
        channel={analytics.ANALYTICS_CHANNEL}
        onEvent={analyticsSpy}
      >
        <IntlProvider locale="en">
          <SmartCardProvider>
            <HoverCardForbiddenView
              flexibleCardProps={{
                cardState: {
                  status: 'forbidden',
                  details: customResponse,
                },
                children: {},
                url: mockUrl,
              }}
            />
          </SmartCardProvider>
        </IntlProvider>
      </AnalyticsListener>,
    );

    return { findByTestId, queryByTestId, analyticsSpy, user };
  };

  it('renders forbidden hover card content', async () => {
    const { findByTestId } = await setUpHoverCard();
    await findByTestId(forbiddenViewTestId);
    const titleElement = await findByTestId('hover-card-forbidden-view-title');
    const mainContentElement = await findByTestId(
      'hover-card-forbidden-view-content',
    );
    const buttonElement = await findByTestId(
      'hover-card-forbidden-view-button',
    );

    expect(titleElement.textContent).toBe('Join Jira to view this content');
    expect(mainContentElement.textContent).toBe(
      'Your team uses Jira to collaborate and you can start using it right away!',
    );
    expect(buttonElement.textContent).toBe('Join now');
  });

  it('does not render forbidden hover card when accessContext is undefined', async () => {
    const mockResponse = getMockForbiddenDirectAccessResponse();
    mockResponse.meta.requestAccess = undefined;
    const { queryByTestId } = await setUpHoverCard(mockResponse);
    const hoverCard = await queryByTestId(forbiddenViewTestId);

    expect(hoverCard).not.toBeInTheDocument();
  });

  it('does not render forbidden hover card when accessContext is malformed', async () => {
    const mockResponse = getMockForbiddenDirectAccessResponse();
    mockResponse.meta.requestAccess = {
      accessType: 'blah',
    };
    const { queryByTestId } = await setUpHoverCard(mockResponse);
    const hoverCard = await queryByTestId(forbiddenViewTestId);

    expect(hoverCard).not.toBeInTheDocument();
  });

  it('fires buttonClicked event on click of the request access button', async () => {
    const { findByTestId, analyticsSpy, user } = await setUpHoverCard();

    window.open = jest.fn();

    const buttonElement = await findByTestId(
      'hover-card-forbidden-view-button',
    );
    await user.click(buttonElement);

    expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'crossJoin',
          eventType: 'ui',
        },
      },
      analytics.ANALYTICS_CHANNEL,
    );
  });
});
