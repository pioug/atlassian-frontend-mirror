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
import { KEY_SENSITIVE_DATA } from '../../utils/analytics';

describe('smart-card: forbidden analytics', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockWindowOpen: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn(async () => mocks.forbidden);
    mockClient = new (fakeFactory(mockFetch))();
    mockWindowOpen = jest.fn();
    /// @ts-ignore
    global.open = mockWindowOpen;
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('forbidden', () => {
    it('should fire analytics events when attempting to connect with an alternate account succeeds', async () => {
      const mockUrl = 'this.is.the.fourth.url';
      const { getByTestId, container } = render(
        <Provider client={mockClient}>
          <Card testId="forbiddenCard1" appearance="inline" url={mockUrl} />
        </Provider>,
      );
      const forbiddenLink = await waitForElement(
        () => getByTestId('forbiddenCard1-forbidden'),
        {
          timeout: 10000,
        },
      );
      const forbiddenLinkButton = container.querySelector('button');
      expect(forbiddenLink).toBeTruthy();
      expect(forbiddenLinkButton).toBeTruthy();
      expect(forbiddenLinkButton!.innerHTML).toContain('Try another');
      // Mock out auth flow, & click connect.
      mockAuthFlow.mockImplementationOnce(async () => ({}));
      fireEvent.click(forbiddenLinkButton!);

      mockFetch.mockImplementationOnce(async () => mocks.success);
      const resolvedView = await waitForElement(
        () => getByTestId('forbiddenCard1-resolved'),
        {
          timeout: 10000,
        },
      );
      expect(resolvedView).toBeTruthy();
      expect(mockEvents.unresolvedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.uiAuthAlternateAccountEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.trackAppAccountConnected).toHaveBeenCalledTimes(1);
      expect(mockEvents.connectSucceededEvent).toHaveBeenCalledTimes(1);
    });

    it('should fire analytics events when attempting to connect with an alternate account fails', async () => {
      const mockUrl = 'this.is.the.fifth.url';
      const { getByTestId, container } = render(
        <Provider client={mockClient}>
          <Card testId="forbiddenCard2" appearance="inline" url={mockUrl} />
        </Provider>,
      );
      const forbiddenLink = await waitForElement(
        () => getByTestId('forbiddenCard2-forbidden'),
        {
          timeout: 10000,
        },
      );
      const forbiddenLinkButton = container.querySelector('button');
      expect(forbiddenLink).toBeTruthy();
      expect(forbiddenLinkButton).toBeTruthy();
      expect(forbiddenLinkButton!.innerHTML).toContain('Try another');
      // Mock out auth flow, & click connect.
      mockAuthFlow.mockImplementationOnce(() => Promise.reject(new Error()));
      fireEvent.click(forbiddenLinkButton!);

      mockFetch.mockImplementationOnce(async () => mocks.success);
      const unresolvedView = await waitForElement(
        () => getByTestId('forbiddenCard2-resolved'),
        {
          timeout: 10000,
        },
      );
      expect(unresolvedView).toBeTruthy();
      expect(mockEvents.unresolvedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.uiAuthAlternateAccountEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.connectFailedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.connectFailedEvent).toHaveBeenCalledWith(
        'd1',
        KEY_SENSITIVE_DATA,
      );
    });
  });
});
