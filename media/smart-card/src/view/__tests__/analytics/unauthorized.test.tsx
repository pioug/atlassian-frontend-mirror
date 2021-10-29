import './unauthorized.test.mock';
import { asMockFunction } from '@atlaskit/media-test-helpers';
import { auth, AuthError } from '@atlaskit/outbound-auth-flow-client';
import * as analytics from '../../../utils/analytics';
import CardClient from '../../../client';
import React from 'react';
import { Card } from '../../Card';
import { Provider } from '../../..';
import { fakeFactory, mocks } from '../../../utils/mocks';
import {
  render,
  waitForElement,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import * as ufoWrapper from '../../../state/analytics/ufoExperiences';
import 'jest-extended';
import { JestFunction } from '@atlaskit/media-test-helpers';
import uuid from 'uuid';

describe('smart-card: unauthorized analytics', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockWindowOpen: jest.Mock;
  let mockUuid = require('uuid').default as JestFunction<typeof uuid>;

  const mockStartUfoExperience = jest.spyOn(ufoWrapper, 'startUfoExperience');
  const mockSucceedUfoExperience = jest.spyOn(
    ufoWrapper,
    'succeedUfoExperience',
  );

  beforeEach(() => {
    mockFetch = jest.fn(async () => mocks.success);
    mockClient = new (fakeFactory(mockFetch))();
    mockWindowOpen = jest.fn();
    mockUuid.mockReturnValue('some-uuid-1');
    /// @ts-ignore
    global.open = mockWindowOpen;
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('unauthorized', () => {
    it('should fire connectSucceeded event when auth succeeds', async () => {
      const mockUrl = 'https://https://this.is.a.url';
      mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
      const { getByTestId, container } = render(
        <Provider client={mockClient}>
          <Card testId="unauthorizedCard1" appearance="inline" url={mockUrl} />
        </Provider>,
      );
      const unauthorizedLink = await waitForElement(
        () => getByTestId('unauthorizedCard1-unauthorized-view'),
        { timeout: 10000 },
      );
      const unauthorizedLinkButton = container.querySelector('[type="button"]');
      expect(unauthorizedLink).toBeTruthy();
      expect(unauthorizedLinkButton).toBeTruthy();
      expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
      // Mock out auth flow, & click connect.
      asMockFunction(auth).mockImplementationOnce(async () => {});
      fireEvent.click(unauthorizedLinkButton!);

      mockFetch.mockImplementationOnce(async () => mocks.success);
      const resolvedView = await waitForElement(() =>
        getByTestId('unauthorizedCard1-resolved-view'),
      );
      expect(resolvedView).toBeTruthy();
      expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
      expect(analytics.uiAuthEvent).toHaveBeenCalledTimes(1);
      expect(analytics.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
      expect(analytics.trackAppAccountConnected).toHaveBeenCalledTimes(1);
      expect(analytics.connectSucceededEvent).toHaveBeenCalledTimes(1);
      expect(analytics.fireSmartLinkEvent).toBeCalledWith(
        {
          action: 'unresolved',
          attributes: {
            componentName: 'smart-cards',
            display: 'inline',
          },
        },
        expect.any(Function),
      );
      expect(mockStartUfoExperience).toBeCalledWith(
        'smart-link-authenticated',
        'some-uuid-1',
        { extensionKey: 'object-provider', status: 'success' },
      );

      expect(mockSucceedUfoExperience).toBeCalledWith(
        'smart-link-authenticated',
        'some-uuid-1',
        {
          display: 'inline',
        },
      );
      expect(mockStartUfoExperience).toHaveBeenCalledBefore(
        mockSucceedUfoExperience as jest.Mock,
      );
    });

    it.each`
      errorType
      ${undefined}
      ${'access_denied'}
    `(
      'should fire connectFailed event when auth fails with errorType = $errorType',
      async (errorType) => {
        const mockUrl = 'https://https://this.is.the.second.url';
        mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
        const { getByTestId, container } = render(
          <Provider client={mockClient}>
            <Card
              testId="unauthorizedCard2"
              appearance="inline"
              url={mockUrl}
            />
          </Provider>,
        );
        const unauthorizedLink = await waitForElement(
          () => getByTestId('unauthorizedCard2-unauthorized-view'),
          { timeout: 10000 },
        );
        const unauthorizedLinkButton = container.querySelector(
          '[type="button"]',
        );
        expect(unauthorizedLink).toBeTruthy();
        expect(unauthorizedLinkButton).toBeTruthy();
        expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
        // Mock out auth flow, & click connect.
        asMockFunction(auth).mockImplementationOnce(() =>
          Promise.reject(new AuthError('', errorType)),
        );
        fireEvent.click(unauthorizedLinkButton!);

        const unresolvedView = await waitForElement(
          () => getByTestId('unauthorizedCard2-unauthorized-view'),
          {
            timeout: 10000,
          },
        );
        expect(unresolvedView).toBeTruthy();
        expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
        expect(analytics.uiAuthEvent).toHaveBeenCalledTimes(1);
        expect(analytics.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
        expect(analytics.connectFailedEvent).toHaveBeenCalledTimes(1);
        expect(analytics.connectFailedEvent).toHaveBeenCalledWith(
          'd1',
          'object-provider',
          errorType,
        );

        expect(mockStartUfoExperience).toBeCalledWith(
          'smart-link-authenticated',
          'some-uuid-1',
          {
            extensionKey: 'object-provider',
            status: errorType,
          },
        );

        expect(mockSucceedUfoExperience).toBeCalledWith(
          'smart-link-authenticated',
          'some-uuid-1',
          {
            display: 'inline',
          },
        );
      },
    );

    it('should fire connectFailed when auth dialog was closed', async () => {
      const mockUrl = 'https://https://this.is.the.third.url';
      mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
      const { getByTestId, container } = render(
        <Provider client={mockClient}>
          <Card testId="unauthorizedCard3" appearance="inline" url={mockUrl} />
        </Provider>,
      );
      const unauthorizedLink = await waitForElement(
        () => getByTestId('unauthorizedCard3-unauthorized-view'),
        { timeout: 10000 },
      );
      const unauthorizedLinkButton = container.querySelector('[type="button"]');
      expect(unauthorizedLink).toBeTruthy();
      expect(unauthorizedLinkButton).toBeTruthy();
      expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
      // Mock out auth flow, & click connect.
      asMockFunction(auth).mockImplementationOnce(() =>
        Promise.reject(new AuthError('', 'auth_window_closed')),
      );
      fireEvent.click(unauthorizedLinkButton!);

      const resolvedView = await waitForElement(
        () => getByTestId('unauthorizedCard3-resolved-view'),
        {
          timeout: 10000,
        },
      );
      expect(resolvedView).toBeTruthy();
      expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
      expect(analytics.uiAuthEvent).toHaveBeenCalledTimes(1);
      expect(analytics.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
      expect(analytics.uiClosedAuthEvent).toHaveBeenCalledTimes(1);
      expect(analytics.connectFailedEvent).toHaveBeenCalledTimes(1);
      expect(analytics.connectFailedEvent).toHaveBeenCalledWith(
        'd1',
        'object-provider',
        'auth_window_closed',
      );

      expect(mockStartUfoExperience).toBeCalledWith(
        'smart-link-authenticated',
        'some-uuid-1',
        {
          extensionKey: 'object-provider',
          status: 'auth_window_closed',
        },
      );

      expect(mockSucceedUfoExperience).toBeCalledWith(
        'smart-link-authenticated',
        'some-uuid-1',
        {
          display: 'inline',
        },
      );
    });
  });
});
