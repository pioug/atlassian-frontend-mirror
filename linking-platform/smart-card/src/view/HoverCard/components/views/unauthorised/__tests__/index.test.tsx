import React from 'react';
import '../../../../../__mocks__/intersection-observer.mock';
import { IntlProvider } from 'react-intl-next';
import { mockUnauthorisedResponse } from '../../../../__tests__/__mocks__/mocks';
import { fireEvent, render } from '@testing-library/react';
import { fakeFactory } from '../../../../../../utils/mocks';
import { Card } from '../../../../../Card';
import { Provider } from '../../../../../../';
import { CardClient } from '@atlaskit/link-provider';

describe('Unauthorised Hover Card', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockUrl: string;

  const setup = async () => {
    mockFetch = jest.fn(() => Promise.resolve(mockUnauthorisedResponse));
    mockClient = new (fakeFactory(mockFetch))();
    mockUrl = 'https://some.url';

    const { queryByTestId, findByTestId, debug } = render(
      <IntlProvider locale="en">
        <Provider
          client={mockClient}
          featureFlags={{ showAuthTooltip: 'experiment' }}
        >
          <Card appearance="inline" url={mockUrl} showHoverPreview={true} />
        </Provider>
      </IntlProvider>,
    );

    const element = await findByTestId('inline-card-unauthorized-view');

    jest.useFakeTimers();
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date('April 1, 2022 00:00:00').getTime());

    fireEvent.mouseEnter(element);

    return { findByTestId, queryByTestId, element, debug };
  };

  it('renders Unauthorised hover card', async () => {
    const { findByTestId } = await setup();
    jest.runAllTimers();
    const unauthorisedHoverCard = await findByTestId(
      'hover-card-unauthorised-view',
    );

    expect(unauthorisedHoverCard).toBeTruthy();
  });

  it('renders Unauthorised hover card content', async () => {
    const { findByTestId } = await setup();
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
      'Connect Google to Atlassian to view more details from your work and collaboration from one place. Learn more about smart link security and permissions.',
    );
    expect(buttonElement.textContent).toBe('Connect to Google');
  });

  it('"learn more" link should have a correct url', async () => {
    const { findByTestId } = await setup();
    jest.runAllTimers();

    const learnMoreLink = await findByTestId(
      'unauthorised-view-content-learn-more',
    );
    expect(learnMoreLink.getAttribute('href')).toBe(
      'https://support.atlassian.com/confluence-cloud/docs/insert-links-and-anchors/#Smart-links',
    );
  });
});
