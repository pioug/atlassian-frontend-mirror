import './card-states.card.test.mock';

import { render, cleanup, waitFor } from '@testing-library/react';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { type CardClient, type CardProviderStoreOpts } from '@atlaskit/link-provider';
import { IntlProvider } from 'react-intl-next';
import * as analytics from '../../../utils/analytics';
import { fakeFactory, mockGenerator, mocks } from '../../../utils/mocks';
import { Provider } from '../../..';
import { Card } from '../../Card';
import React from 'react';

mockSimpleIntersectionObserver();

describe('smart-card: card states, flexible block withUrl', () => {
  const mockOnError = jest.fn();
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockUrl: string;

  beforeEach(() => {
    mockFetch = jest.fn(() => Promise.resolve(mocks.success));
    mockClient = new (fakeFactory(mockFetch))();
    mockUrl = 'https://drive.google.com/drive/folders/test';
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('> state: resolved', () => {
    it('flexible block card: should render with metadata when resolved', async () => {
      const { getByText, getByTestId } = render(
        <IntlProvider locale="en">
          <Provider
            client={mockClient}
            featureFlags={{ enableFlexibleBlockCard: true }}
          >
            <Card appearance="block" url={mockUrl} />
          </Provider>
        </IntlProvider>,
      );

      const resolvedCard = await waitFor(() =>
        getByTestId('smart-block-resolved-view'),
      );

      const resolvedViewName = await waitFor(() => getByText('I love cheese'));

      const resolvedViewDescription = await waitFor(() =>
        getByText('Here is your serving of cheese: 🧀'),
      );

      expect(resolvedCard).toBeTruthy();
      expect(resolvedViewName).toBeTruthy();
      expect(resolvedViewDescription).toBeTruthy();
      expect(mockFetch).toBeCalled();
      expect(mockFetch).toBeCalledTimes(1);

      expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledTimes(1);
      expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          display: 'block',
          status: 'resolved',
        }),
      );
    });

    it('should re-render when URL changes', async () => {
      const { getByText, getByTestId, rerender } = render(
        <IntlProvider locale="en">
          <Provider
            client={mockClient}
            featureFlags={{ enableFlexibleBlockCard: true }}
          >
            <Card appearance="block" url={mockUrl} />
          </Provider>
        </IntlProvider>,
      );
      const resolvedCard = await waitFor(() =>
        getByTestId('smart-block-resolved-view'),
      );
      const resolvedView = await waitFor(() => getByText('I love cheese'));

      expect(resolvedCard).toBeTruthy();
      expect(resolvedView).toBeTruthy();
      expect(mockFetch).toBeCalled();
      expect(mockFetch).toBeCalledTimes(1);

      rerender(
        <IntlProvider locale="en">
          <Provider client={mockClient}>
            <Card appearance="block" url="https://google.com" />
          </Provider>
        </IntlProvider>,
      );

      expect(mockFetch).toBeCalled();
      expect(mockFetch).toBeCalledTimes(2);
    });

    it('should not re-render when appearance changes', async () => {
      let resolvedView = null;
      const { getByText, getByTestId, rerender } = render(
        <IntlProvider locale="en">
          <Provider
            client={mockClient}
            featureFlags={{ enableFlexibleBlockCard: true }}
          >
            <Card appearance="block" url={mockUrl} />
          </Provider>
        </IntlProvider>,
      );

      const resolvedCard = await waitFor(() =>
        getByTestId('smart-block-resolved-view'),
      );
      resolvedView = await waitFor(() => getByText('I love cheese'));
      expect(resolvedCard).toBeTruthy();
      expect(resolvedView).toBeTruthy();
      expect(mockFetch).toBeCalled();
      expect(mockFetch).toBeCalledTimes(1);

      rerender(
        <IntlProvider locale="en">
          <Provider client={mockClient}>
            <Card appearance="block" url={mockUrl} />
          </Provider>
        </IntlProvider>,
      );
      expect(mockFetch).toBeCalled();
      expect(mockFetch).toBeCalledTimes(1);
    });
  });

  describe('> state: forbidden', () => {
    const getResponseWithAccessType = (accessType: string) => ({
      data: {
        ...mocks.forbidden.data,
        generator: {
          '@type': 'Application',
          name: 'Google',
          icon: {
            '@type': 'Image',
            url: 'https://developers.google.com/drive/images/drive_icon.png',
          },
          image: 'https://links.atlassian.com/images/google_drive.svg',
        },
      },
      meta: {
        ...mocks.forbidden.meta,
        requestAccess: {
          accessType: accessType,
        },
      },
    });

    describe('with auth services available', () => {
      it('flexible block card: renders the forbidden view if no access, with auth prompt', async () => {
        mockFetch.mockImplementationOnce(async () => mocks.forbidden);
        const { getByText, getByTestId, container } = render(
          <Provider
            client={mockClient}
            featureFlags={{ enableFlexibleBlockCard: true }}
          >
            <Card appearance="block" url={mockUrl} onError={mockOnError} />
          </Provider>,
        );
        const frame = await waitFor(() =>
          getByTestId('smart-block-forbidden-view'),
        );
        expect(frame).toBeTruthy();
        const forbiddenLink = await waitFor(() =>
          getByText('Restricted content'),
        );
        expect(forbiddenLink).toBeTruthy();
        const forbiddenLinkButton = container.querySelector('button');
        expect(forbiddenLinkButton).toBeTruthy();
        expect(forbiddenLinkButton!.textContent).toContain(
          'Try another account',
        );
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith({
          url: mockUrl,
          status: 'forbidden',
        });
      });

      it('flexible block card: renders the forbidden view with "Direct Access" access type', async () => {
        mockFetch.mockImplementationOnce(async () =>
          getResponseWithAccessType('DIRECT_ACCESS'),
        );
        const { getByText, getByTestId, container } = render(
          <Provider
            client={mockClient}
            featureFlags={{ enableFlexibleBlockCard: true }}
          >
            <Card appearance="block" url={mockUrl} onError={mockOnError} />
          </Provider>,
        );
        const frame = await waitFor(() =>
          getByTestId('smart-block-forbidden-view'),
        );
        expect(frame).toBeTruthy();
        const forbiddenLink = await waitFor(() =>
          getByText('Join Google to view this content'),
        );
        expect(forbiddenLink).toBeTruthy();

        const messageContainer = await waitFor(() =>
          getByTestId('smart-element-text'),
        );
        expect(messageContainer.textContent).toBe(
          'Your team uses Google to collaborate and you can start using it right away!',
        );

        const buttons = container.querySelectorAll('button');
        expect(buttons?.length).toBe(2);

        const forbiddenLinkButton = buttons[0];
        expect(forbiddenLinkButton).toBeTruthy();
        expect(forbiddenLinkButton!.textContent).toContain(
          'Try another account',
        );

        const joinButton = buttons[1];
        expect(joinButton).toBeTruthy();
        expect(joinButton!.textContent).toBe('Join now');

        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith({
          url: mockUrl,
          status: 'forbidden',
        });
      });

      it('flexible block card: renders the forbidden view with "Request Access" access type', async () => {
        mockFetch.mockImplementationOnce(async () =>
          getResponseWithAccessType('REQUEST_ACCESS'),
        );
        const { getByText, getByTestId, container } = render(
          <Provider
            client={mockClient}
            featureFlags={{ enableFlexibleBlockCard: true }}
          >
            <Card appearance="block" url={mockUrl} onError={mockOnError} />
          </Provider>,
        );
        const frame = await waitFor(() =>
          getByTestId('smart-block-forbidden-view'),
        );
        expect(frame).toBeTruthy();
        const forbiddenLink = await waitFor(() =>
          getByText('Join Google to view this content'),
        );
        expect(forbiddenLink).toBeTruthy();

        const messageContainer = await waitFor(() =>
          getByTestId('smart-element-text'),
        );
        expect(messageContainer.textContent).toBe(
          'Your team uses Google to collaborate. Send your admin a request for access.',
        );

        const buttons = container.querySelectorAll('button');
        expect(buttons?.length).toBe(2);

        const forbiddenLinkButton = buttons[0];
        expect(forbiddenLinkButton).toBeTruthy();
        expect(forbiddenLinkButton!.textContent).toContain(
          'Try another account',
        );

        const joinButton = buttons[1];
        expect(joinButton).toBeTruthy();
        expect(joinButton!.textContent).toBe('Request access');

        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith({
          url: mockUrl,
          status: 'forbidden',
        });
      });

      it('flexible block card: renders the forbidden view with "Pending Request Exists" access type', async () => {
        mockFetch.mockImplementationOnce(async () =>
          getResponseWithAccessType('PENDING_REQUEST_EXISTS'),
        );
        const { getByText, getByTestId, container } = render(
          <Provider
            client={mockClient}
            featureFlags={{ enableFlexibleBlockCard: true }}
          >
            <Card appearance="block" url={mockUrl} onError={mockOnError} />
          </Provider>,
        );
        const frame = await waitFor(() =>
          getByTestId('smart-block-forbidden-view'),
        );
        expect(frame).toBeTruthy();
        const forbiddenLink = await waitFor(() =>
          getByText('Access to Google is pending'),
        );
        expect(forbiddenLink).toBeTruthy();

        const messageContainer = await waitFor(() =>
          getByTestId('smart-element-text'),
        );
        expect(messageContainer.textContent).toBe(
          'Your request to access drive.google.com is awaiting admin approval.',
        );

        const forbiddenLinkButton = container.querySelector('button');
        expect(forbiddenLinkButton).toBeTruthy();
        expect(forbiddenLinkButton!.textContent).toContain(
          'Try another account',
        );

        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith({
          url: mockUrl,
          status: 'forbidden',
        });
      });

      it('flexible block card: renders the forbidden view with "Forbidden" access type', async () => {
        mockFetch.mockImplementationOnce(async () =>
          getResponseWithAccessType('FORBIDDEN'),
        );
        const { getByText, getByTestId, container } = render(
          <Provider
            client={mockClient}
            featureFlags={{ enableFlexibleBlockCard: true }}
          >
            <Card appearance="block" url={mockUrl} onError={mockOnError} />
          </Provider>,
        );
        const frame = await waitFor(() =>
          getByTestId('smart-block-forbidden-view'),
        );
        expect(frame).toBeTruthy();
        const forbiddenLink = await waitFor(() =>
          getByText("You don't have access to this content"),
        );
        expect(forbiddenLink).toBeTruthy();

        const messageContainer = await waitFor(() =>
          getByTestId('smart-element-text'),
        );
        expect(messageContainer.textContent).toBe(
          'Contact your admin to request access to drive.google.com.',
        );

        const forbiddenLinkButton = container.querySelector('button');
        expect(forbiddenLinkButton).toBeTruthy();
        expect(forbiddenLinkButton!.textContent).toContain(
          'Try another account',
        );

        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith({
          url: mockUrl,
          status: 'forbidden',
        });
      });

      it('flexible block card: renders the forbidden view with "Denied Request Exists" access type', async () => {
        mockFetch.mockImplementationOnce(async () =>
          getResponseWithAccessType('DENIED_REQUEST_EXISTS'),
        );
        const { getByText, getByTestId, container } = render(
          <Provider
            client={mockClient}
            featureFlags={{ enableFlexibleBlockCard: true }}
          >
            <Card appearance="block" url={mockUrl} onError={mockOnError} />
          </Provider>,
        );
        const frame = await waitFor(() =>
          getByTestId('smart-block-forbidden-view'),
        );
        expect(frame).toBeTruthy();
        const forbiddenLink = await waitFor(() =>
          getByText("You don't have access to this content"),
        );
        expect(forbiddenLink).toBeTruthy();

        const messageContainer = await waitFor(() =>
          getByTestId('smart-element-text'),
        );
        expect(messageContainer.textContent).toBe(
          "Your admin didn't approve your request to view Google pages from drive.google.com.",
        );

        const forbiddenLinkButton = container.querySelector('button');
        expect(forbiddenLinkButton).toBeTruthy();
        expect(forbiddenLinkButton!.textContent).toContain(
          'Try another account',
        );

        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith({
          url: mockUrl,
          status: 'forbidden',
        });
      });
    });

    describe('with no auth services available', () => {
      it('flexible block card: renders the forbidden view if no access, no auth prompt', async () => {
        mocks.forbidden.meta.auth = [];
        mockFetch.mockImplementationOnce(async () => mocks.forbidden);
        const { getByText, getByTestId, container } = render(
          <Provider
            client={mockClient}
            featureFlags={{ enableFlexibleBlockCard: true }}
          >
            <Card appearance="block" url={mockUrl} onError={mockOnError} />
          </Provider>,
        );
        const frame = await waitFor(() =>
          getByTestId('smart-block-forbidden-view'),
        );
        expect(frame).toBeTruthy();
        const forbiddenLink = await waitFor(() =>
          getByText('Restricted content'),
        );
        const forbiddenLinkButton = container.querySelector('button');
        expect(forbiddenLink).toBeTruthy();
        expect(forbiddenLinkButton).toBeFalsy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith({
          url: mockUrl,
          status: 'forbidden',
        });
      });
    });
  });

  describe('> state: unauthorized', () => {
    it('renders correctly when provider details are not available', async () => {
      mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
      const { getByText, getByTestId, queryByTestId } = render(
        <Provider
          client={mockClient}
          featureFlags={{ enableFlexibleBlockCard: true }}
        >
          <Card appearance="block" url={mockUrl} onError={mockOnError} />
        </Provider>,
      );
      const frame = await waitFor(() =>
        getByTestId('smart-block-unauthorized-view'),
      );
      expect(frame).toBeTruthy();

      const unauthorizedLink = await waitFor(() => getByText(mockUrl));
      expect(unauthorizedLink).toBeTruthy();

      expect(mockFetch).toBeCalled();
      expect(mockFetch).toBeCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith({
        url: mockUrl,
        status: 'unauthorized',
      });

      const unauthorizedContent = getByTestId(
        'smart-block-unauthorized-view-content',
      );
      expect(unauthorizedContent).toBeTruthy();
      expect(unauthorizedContent.textContent).toBe(
        'Connect your account to collaborate on work across Atlassian products. Learn more about Smart Links.',
      );

      const providerImage = queryByTestId(
        'smart-block-card-footer-provider-image',
      );
      expect(providerImage).toBeFalsy();

      const providerLabel = queryByTestId(
        'smart-block-card-footer-provider-label',
      );
      expect(providerLabel).toBeFalsy();

      const connectButton = getByTestId('smart-action-connect-account');
      expect(connectButton).toBeTruthy();
      expect(connectButton.innerHTML).not.toContain('Connect to');
      expect(connectButton.innerHTML).toContain('Connect');
    });

    it('renders with connect flow when auth services are available', async () => {
      const unauthorizedMockWithProviderDetails = {
        ...mocks.unauthorized,
        data: {
          ...mocks.unauthorized.data,
          generator: {
            '@type': 'Application',
            name: 'Google',
            icon: {
              '@type': 'Image',
              url: 'https://developers.google.com/drive/images/drive_icon.png',
            },
            image: 'https://links.atlassian.com/images/google_drive.svg',
          },
        },
      };
      mockFetch.mockImplementationOnce(
        async () => unauthorizedMockWithProviderDetails,
      );
      const { getByText, getByTestId } = render(
        <Provider
          client={mockClient}
          featureFlags={{ enableFlexibleBlockCard: true }}
        >
          <Card appearance="block" url={mockUrl} onError={mockOnError} />
        </Provider>,
      );
      const frame = await waitFor(() =>
        getByTestId('smart-block-unauthorized-view'),
      );
      expect(frame).toBeTruthy();

      const unauthorizedLink = await waitFor(() => getByText(mockUrl));
      expect(unauthorizedLink).toBeTruthy();

      expect(mockFetch).toBeCalled();
      expect(mockFetch).toBeCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith({
        url: mockUrl,
        status: 'unauthorized',
      });

      const unauthorizedTitle = getByTestId('smart-block-title-errored-view');
      expect(unauthorizedTitle).toBeTruthy();

      // Title should only have the icon and the url
      expect(unauthorizedTitle.childElementCount).toEqual(2);

      const imgTags = unauthorizedTitle.children[0].getElementsByTagName('img');
      expect(imgTags).toBeTruthy();
      expect(imgTags.length).toEqual(1);
      expect(imgTags[0].getAttribute('src')).toEqual(
        'https://developers.google.com/drive/images/drive_icon.png',
      );

      expect(unauthorizedTitle.children[1].innerHTML).toContain(
        'https://drive.google.com/drive/folders/test',
      );

      const unauthorizedContent = getByTestId(
        'smart-block-unauthorized-view-content',
      );
      expect(unauthorizedContent).toBeTruthy();
      expect(unauthorizedContent.textContent).toBe(
        'Connect your Google account to collaborate on work across Atlassian products. Learn more about Smart Links.',
      );

      const providerImage = getByTestId(
        'smart-block-card-footer-provider-image',
      );
      expect(providerImage).toBeTruthy();
      expect(providerImage.getAttribute('src')).toEqual(
        'https://developers.google.com/drive/images/drive_icon.png',
      );

      const providerLabel = getByTestId(
        'smart-block-card-footer-provider-label',
      );
      expect(providerLabel).toBeTruthy();
      expect(providerLabel.innerHTML).toContain('Google');
      const connectButton = getByTestId('smart-action-connect-account');
      expect(connectButton).toBeTruthy();
      expect(connectButton.innerHTML).toContain('Connect to Google');
    });

    it('renders without connect flow when auth services are not available', async () => {
      mocks.unauthorized.meta.auth = [];
      mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
      const { getByText, getByTestId, container } = render(
        <Provider
          client={mockClient}
          featureFlags={{ enableFlexibleBlockCard: true }}
        >
          <Card appearance="block" url={mockUrl} onError={mockOnError} />
        </Provider>,
      );
      const frame = await waitFor(() =>
        getByTestId('smart-block-unauthorized-view'),
      );
      expect(frame).toBeTruthy();
      const unauthorizedLink = await waitFor(() => getByText(mockUrl));
      const unauthorizedLinkButton = container.querySelector('button');
      expect(unauthorizedLink).toBeTruthy();
      expect(unauthorizedLinkButton).toBeFalsy();
      expect(mockFetch).toBeCalled();
      expect(mockFetch).toBeCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith({
        url: mockUrl,
        status: 'unauthorized',
      });
    });
  });

  describe('> state: error', () => {
    it('flexible block card: renders error card when resolve fails', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.reject(new Error('Something went wrong')),
      );
      const { findByText, findByTestId } = render(
        <Provider
          client={mockClient}
          featureFlags={{ enableFlexibleBlockCard: true }}
        >
          <Card appearance="block" url={mockUrl} onError={mockOnError} />
        </Provider>,
      );
      const frame = await findByTestId('smart-block-errored-view');
      const link = await findByText(mockUrl);

      expect(frame).toBeTruthy();
      expect(link).toBeTruthy();
      expect(mockFetch).toBeCalled();
      expect(mockFetch).toBeCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith({
        url: mockUrl,
        status: 'errored',
      });
    });

    it('flexible block card: renders not found card when link not found', async () => {
      mockFetch.mockImplementationOnce(async () => ({
        ...mocks.notFound,
        data: {
          ...mocks.notFound.data,
          generator: mockGenerator,
        },
      }));

      const { getByTestId, getByText } = render(
        <Provider
          client={mockClient}
          featureFlags={{ enableFlexibleBlockCard: true }}
        >
          <Card appearance="block" url={mockUrl} onError={mockOnError} />
        </Provider>,
      );
      const frame = await waitFor(() =>
        getByTestId('smart-block-not-found-view'),
      );
      expect(frame).toBeTruthy();
      const link = await waitFor(() =>
        getByText("We can't show you this Jira page"),
      );
      expect(link).toBeTruthy();
      expect(mockFetch).toBeCalled();
      expect(mockFetch).toBeCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith({
        url: mockUrl,
        status: 'not_found',
      });
    });
  });

  describe('> state: invalid', () => {
    it('block: does not throw error when state is invalid', async () => {
      const storeOptions = {
        initialState: { [mockUrl]: {} },
      } as CardProviderStoreOpts;
      const { findByTestId } = render(
        <Provider
          client={mockClient}
          storeOptions={storeOptions}
          featureFlags={{ enableFlexibleBlockCard: true }}
        >
          <Card appearance="block" url={mockUrl} />
        </Provider>,
      );

      const link = await findByTestId('smart-block-resolved-view');
      expect(link).toBeTruthy();
    });
  });
});
