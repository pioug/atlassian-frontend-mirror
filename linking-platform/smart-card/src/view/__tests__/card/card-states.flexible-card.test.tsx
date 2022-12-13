import '../../__mocks__/intersection-observer.mock';

jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock(
  'react-transition-group/Transition',
  () => (data: any) => data.children,
);
import { render, cleanup, waitFor } from '@testing-library/react';
import { CardClient } from '@atlaskit/link-provider';
import { fakeFactory, mocks } from '../../../utils/mocks';
import { Provider } from '../../..';
import { Card } from '../../Card';
import React from 'react';

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
        'Connect to Atlassian to view more details from your work and collaboration from one place. Learn more about Smart Links.',
      );

      const providerImage = queryByTestId(
        'smart-block-card-footer-provider-image',
      );
      expect(providerImage).toBeFalsy();

      const providerLabel = queryByTestId(
        'smart-block-card-footer-provider-label',
      );
      expect(providerLabel).toBeFalsy();

      const connectButton = getByTestId('smart-action');
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
        'Connect Google to Atlassian to view more details from your work and collaboration from one place. Learn more about Smart Links.',
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
      const connectButton = getByTestId('smart-action');
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
});
