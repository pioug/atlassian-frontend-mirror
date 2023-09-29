import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render } from '@testing-library/react';
import { getMockForbiddenDirectAccessResponse } from '../../../../__tests__/__mocks__/mocks';
import HoverCardForbiddenView from '../index';

const mockResponse = getMockForbiddenDirectAccessResponse();

describe('Forbidden Hover Card', () => {
  const mockUrl = 'https://mock-url.com';

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setUpHoverCard = async () => {
    const { findByTestId } = render(
      <IntlProvider locale="en">
        <HoverCardForbiddenView
          flexibleCardProps={{
            cardState: {
              status: 'forbidden',
              details: mockResponse,
            },
            children: {},
            url: mockUrl,
          }}
        />
      </IntlProvider>,
    );

    return { findByTestId };
  };

  it('renders forbidden hover card content', async () => {
    const { findByTestId } = await setUpHoverCard();
    await findByTestId('hover-card-forbidden-view-resolved-view');
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
});
