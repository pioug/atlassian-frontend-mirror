jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) =>
  data.children,
);
jest.doMock('../../../utils/analytics/analytics');

const mockAPIError = jest.fn();
jest.doMock('../../../client/errors', () => ({
  APIError: mockAPIError,
}));

import React from 'react';
import { JsonLd } from 'json-ld-types';
import { render, cleanup, waitForElement } from '@testing-library/react';
import CardClient from '../../../client';
import { Card } from '../../Card';
import { Provider } from '../../..';
import { fakeFactory, mocks } from '../../../utils/mocks';

describe('smart-card: card states, embed', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockUrl: string;

  beforeEach(() => {
    mockFetch = jest.fn(() => Promise.resolve(mocks.success));
    mockClient = new (fakeFactory(mockFetch))();
    mockUrl = 'https://some.url';
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('render method: withUrl', () => {
    describe('> state: loading', () => {
      it('embed: should render loading state initially', async () => {
        const { getByTestId } = render(
          <Provider client={mockClient}>
            <Card appearance="embed" url={mockUrl} />
          </Provider>,
        );
        const loadingView = await waitForElement(() =>
          getByTestId('embed-card-resolving-view'),
        );
        expect(loadingView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });
    });

    describe('> state: resolved', () => {
      it('embed: should render with metadata when resolved', async () => {
        const { getByTestId } = render(
          <Provider client={mockClient}>
            <Card appearance="embed" url={mockUrl} />
          </Provider>,
        );
        const resolvedViewName = await waitForElement(() =>
          getByTestId('embed-card-resolved-view-frame'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(resolvedViewName.getAttribute('src')).toEqual(
          'https://www.ilovecheese.com',
        );
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });

      it('embed: should render with metadata when resolved, as block card - no preview present', async () => {
        const successWithoutPreview = {
          ...mocks.success,
          data: {
            ...mocks.success.data,
            preview: undefined,
          },
        } as JsonLd.Response;

        mockFetch.mockImplementationOnce(async () => successWithoutPreview);
        const { getByText } = render(
          <Provider client={mockClient}>
            <Card appearance="embed" url={mockUrl} />
          </Provider>,
        );
        const resolvedViewName = await waitForElement(() =>
          getByText('I love cheese'),
        );
        const resolvedViewDescription = await waitForElement(() =>
          getByText('Here is your serving of cheese: 🧀'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(resolvedViewDescription).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });

      it('embed: should render with metadata when resolved, as inline card - preview present, platform set', async () => {
        const successWithPreviewOnWeb = {
          ...mocks.success,
          data: {
            ...mocks.success.data,
            preview: {
              '@type': 'Link',
              href: 'https://some/preview',
              'atlassian:supportedPlatforms': ['web'],
            },
          },
        } as JsonLd.Response;

        mockFetch.mockImplementationOnce(async () => successWithPreviewOnWeb);
        const { getByText, getByTestId } = render(
          <Provider client={mockClient}>
            <Card appearance="embed" url={mockUrl} platform="mobile" />
          </Provider>,
        );
        const resolvedViewName = await waitForElement(() =>
          getByText('I love cheese'),
        );
        const resolvedViewDescription = await waitForElement(() =>
          getByTestId('inline-card-resolved-view'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(resolvedViewDescription).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });

      it('should re-render when URL changes', async () => {
        let resolvedView = null;
        const { getByText, rerender } = render(
          <Provider client={mockClient}>
            <Card appearance="embed" url={mockUrl} />
          </Provider>,
        );
        resolvedView = await waitForElement(() => getByText('I love cheese'));
        expect(resolvedView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);

        rerender(
          <Provider client={mockClient}>
            <Card appearance="embed" url="https://google.com" />
          </Provider>,
        );
        resolvedView = await waitForElement(() => getByText('I love cheese'));
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(2);
      });

      it('should not re-render when appearance changes', async () => {
        let resolvedView = null;
        const { getByText, rerender } = render(
          <Provider client={mockClient}>
            <Card appearance="embed" url={mockUrl} />
          </Provider>,
        );
        resolvedView = await waitForElement(() => getByText('I love cheese'));
        expect(resolvedView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);

        rerender(
          <Provider client={mockClient}>
            <Card appearance="block" url={mockUrl} />
          </Provider>,
        );
        resolvedView = await waitForElement(() => getByText('I love cheese'));
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });

      it('should pass iframe forward reference down to embed iframe', async () => {
        const iframeRef = React.createRef<HTMLIFrameElement>();
        const { getByTestId } = render(
          <Provider client={mockClient}>
            <Card appearance="embed" url={mockUrl} embedIframeRef={iframeRef} />
          </Provider>,
        );
        const iframeEl = await waitForElement(() =>
          getByTestId('embed-card-resolved-view-frame'),
        );
        expect(iframeEl).toBe(iframeRef.current);
      });
    });

    describe('> state: forbidden', () => {
      describe('with auth services available', () => {
        it('embed: renders the forbidden view if no access, with auth prompt', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.forbidden);
          const { getByText, container } = render(
            <Provider client={mockClient}>
              <Card appearance="embed" url={mockUrl} />
            </Provider>,
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const forbiddenLink = await waitForElement(() =>
            getByText(/Restricted link/),
          );
          expect(forbiddenLink).toBeTruthy();
          const forbiddenLinkButton = container.querySelector('button');
          expect(forbiddenLinkButton).toBeTruthy();
          expect(forbiddenLinkButton!.textContent).toContain(
            'Try another account',
          );
          expect(mockFetch).toBeCalled();
          expect(mockFetch).toBeCalledTimes(1);
        });
      });

      describe('with no auth services available', () => {
        it('embed: renders the forbidden view if no access, no auth prompt', async () => {
          mocks.forbidden.meta.auth = [];
          mockFetch.mockImplementationOnce(async () => mocks.forbidden);
          const { getByText } = render(
            <Provider client={mockClient}>
              <Card appearance="embed" url={mockUrl} />
            </Provider>,
          );
          const forbiddenLink = await waitForElement(() =>
            getByText(/Restricted link/),
          );
          expect(forbiddenLink).toBeTruthy();
          expect(mockFetch).toBeCalled();
          expect(mockFetch).toBeCalledTimes(1);
        });
      });
    });

    describe('> state: unauthorized', () => {
      describe('with auth services available', () => {
        it('embed: renders with connect flow', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
          const { getByText, getByTestId } = render(
            <Provider client={mockClient}>
              <Card
                testId="block-unauthorized-connect"
                appearance="embed"
                url={mockUrl}
              />
            </Provider>,
          );
          const unauthorizedLink = await waitForElement(() =>
            getByText(/Connect your.*?account/),
          );

          expect(unauthorizedLink).toBeTruthy();
          const unauthorizedLinkButton = getByTestId('button-connect-account');
          expect(unauthorizedLinkButton).toBeTruthy();
          expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
          expect(mockFetch).toBeCalled();
          expect(mockFetch).toBeCalledTimes(1);
        });
      });

      describe('with auth services not available', () => {
        it('embed: renders without connect flow', async () => {
          mocks.unauthorized.meta.auth = [];
          mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
          const { getByText } = render(
            <Provider client={mockClient}>
              <Card appearance="embed" url={mockUrl} />
            </Provider>,
          );
          const unauthorizedLink = await waitForElement(() =>
            getByText(/Connect your.*?account/),
          );
          expect(unauthorizedLink).toBeTruthy();
          expect(mockFetch).toBeCalled();
          expect(mockFetch).toBeCalledTimes(1);
        });
      });

      describe('with authFlow explicitly disabled', () => {
        it('embed: renders in error state', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
          const { getByText } = render(
            <Provider client={mockClient} authFlow="disabled">
              <Card appearance="embed" url={mockUrl} />
            </Provider>,
          );
          const errorView = await waitForElement(() =>
            getByText(/We couldn't load this link/),
          );
          expect(errorView).toBeTruthy();
          expect(mockFetch).toBeCalled();
          expect(mockFetch).toBeCalledTimes(1);
        });
      });
    });

    describe('> state: error', () => {
      it('embed: renders not found card when link not found', async () => {
        mockFetch.mockImplementationOnce(async () => mocks.notFound);
        const { getByText } = render(
          <Provider client={mockClient}>
            <Card appearance="embed" url={mockUrl} />
          </Provider>,
        );
        const errorView = await waitForElement(() =>
          getByText(/Uh oh. We can't find this link!/),
        );
        expect(errorView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });
    });
  });

  describe('render method: withData', () => {
    describe('> state: resolved', () => {
      it('embed: renders successfully with data', async () => {
        const { getByText } = render(
          <Provider client={mockClient}>
            <Card appearance="embed" url={mockUrl} data={mocks.success.data} />
          </Provider>,
        );
        const resolvedViewName = await waitForElement(() =>
          getByText('I love cheese'),
        );
        const resolvedViewDescription = await waitForElement(() =>
          getByText('Here is your serving of cheese: 🧀'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(resolvedViewDescription).toBeTruthy();
      });
    });
  });
});
