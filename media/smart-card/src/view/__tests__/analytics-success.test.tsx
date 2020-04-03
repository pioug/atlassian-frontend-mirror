const mockEvents = {
  resolvedEvent: jest.fn(),
  unresolvedEvent: jest.fn(),
  connectSucceededEvent: jest.fn(),
  connectFailedEvent: jest.fn(),
  trackAppAccountConnected: jest.fn(),
  uiAuthEvent: jest.fn(),
  uiAuthAlternateAccountEvent: jest.fn(),
  uiCardClickedEvent: jest.fn(),
  uiClosedAuthEvent: jest.fn(),
  screenAuthPopupEvent: jest.fn(),
  fireSmartLinkEvent: jest.fn(),
};
const mockAuthFlow = jest.fn();

jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) =>
  data.children,
);
jest.doMock('../../utils/analytics', () => mockEvents);
jest.doMock('@atlaskit/outbound-auth-flow-client', () => ({
  auth: mockAuthFlow,
}));
const mockFetchError = jest.fn();
jest.doMock('../../client/errors', () => ({
  FetchError: mockFetchError,
}));
import CardClient from '../../client';
import React from 'react';
import { Card } from '../Card';
import { Provider } from '../..';
import { fakeFactory, mocks } from '../../utils/mocks';
import {
  render,
  waitForElement,
  fireEvent,
  cleanup,
} from '@testing-library/react';

describe('smart-card: success analytics', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockWindowOpen: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn(async () => mocks.success);
    mockClient = new (fakeFactory(mockFetch))();
    mockWindowOpen = jest.fn();
    /// @ts-ignore
    global.open = mockWindowOpen;
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('resolved', () => {
    it('should fire the resolved analytics event when the url was resolved', async () => {
      const mockUrl = 'this.is.the.sixth.url';
      const { getByTestId, getByRole } = render(
        <Provider client={mockClient}>
          <Card testId="resolvedCard1" appearance="inline" url={mockUrl} />
        </Provider>,
      );
      const resolvedView = await waitForElement(
        () => getByTestId('resolvedCard1-resolved'),
        {
          timeout: 10000,
        },
      );
      const resolvedCard = getByRole('button');
      expect(resolvedView).toBeTruthy();
      expect(resolvedCard).toBeTruthy();
      expect(mockEvents.resolvedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.resolvedEvent).toHaveBeenCalledWith('d1');
    });

    it('should fire clicked analytics event when a resolved URL is clicked', async () => {
      const mockUrl = 'this.is.the.seventh.url';
      const { getByTestId, getByRole } = render(
        <Provider client={mockClient}>
          <Card testId="resolvedCard2" appearance="inline" url={mockUrl} />
        </Provider>,
      );
      const resolvedView = await waitForElement(
        () => getByTestId('resolvedCard2-resolved'),
        {
          timeout: 5000,
        },
      );
      const resolvedCard = getByRole('button');
      expect(resolvedView).toBeTruthy();
      expect(resolvedCard).toBeTruthy();
      expect(mockEvents.resolvedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.resolvedEvent).toHaveBeenCalledWith('d1');

      fireEvent.click(resolvedCard);
      expect(mockWindowOpen).toHaveBeenCalledTimes(1);
      expect(mockEvents.uiCardClickedEvent).toHaveBeenCalledTimes(1);
    });
  });
});
