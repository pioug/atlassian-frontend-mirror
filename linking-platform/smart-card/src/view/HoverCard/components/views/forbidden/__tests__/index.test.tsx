import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render } from '@testing-library/react';
import { getMockForbiddenDirectAccessResponse } from '../../../../__tests__/__mocks__/mocks';
import HoverCardForbiddenView from '../index';

const mockResponse = getMockForbiddenDirectAccessResponse();
const forbiddenViewTestId = 'hover-card-forbidden-view-resolved-view';

describe('Forbidden Hover Card', () => {
  const mockUrl = 'https://mock-url.com';

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setUpHoverCard = async (customResponse: any = mockResponse) => {
    const { findByTestId, queryByTestId } = render(
      <IntlProvider locale="en">
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
      </IntlProvider>,
    );

    return { findByTestId, queryByTestId };
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

    expect(titleElement.textContent).toBe('Join your team in Jira');
    expect(mainContentElement.textContent).toBe(
      'All accounts with your same email domain are approved to access mock-url.com in Jira.',
    );
    expect(buttonElement.textContent).toBe('Go to Jira');
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
});
