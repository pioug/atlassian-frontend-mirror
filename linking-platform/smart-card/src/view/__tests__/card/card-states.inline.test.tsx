import './card-states.card.test.mock';

import React from 'react';
import { useEffect, useState, ReactNode, FC } from 'react';
import {
  render,
  cleanup,
  waitFor as waitForElement,
} from '@testing-library/react';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { CardClient, CardProviderStoreOpts } from '@atlaskit/link-provider';
import { Card } from '../../Card';
import { Provider } from '../../..';
import * as analytics from '../../../utils/analytics';
import { fakeFactory, mocks, waitFor } from '../../../utils/mocks';
import { IntlProvider } from 'react-intl-next';

jest.mock('@atlaskit/platform-feature-flags', () => ({
  getBooleanFF: jest
    .fn()
    .mockImplementation(
      (flag) =>
        flag ===
        'platform.linking-platform.smart-card.show-smart-links-refreshed-design',
    ),
}));

mockSimpleIntersectionObserver();

describe('smart-card: card states, inline', () => {
  const mockOnError = jest.fn();
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
      it('inline: should render loading state initially', async () => {
        const { getByTestId } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="inline" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        const loadingView = await waitForElement(() =>
          getByTestId('inline-card-resolving-view'),
        );
        expect(loadingView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });

      it('should work correctly with cache', async () => {
        const DelayedCard: FC<{}> = () => {
          const [component, setComponent] = useState<ReactNode>(<></>);
          useEffect(() => {
            setTimeout(() => {
              setComponent(<Card appearance="inline" url={mockUrl} />);
            }, 500);
          });
          return <span>{component}</span>;
        };

        let resolvingView = null;
        const { getByText, getAllByText } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="inline" url={mockUrl} />
              <DelayedCard />
            </Provider>
          </IntlProvider>,
        );
        expect(getByText(mockUrl)).toBeTruthy();
        // Then URL resolves, triggering update:
        resolvingView = await waitForElement(() => getByText('I love cheese'));
        expect(resolvingView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);

        await waitFor(500);

        resolvingView = await waitForElement(() =>
          getAllByText('I love cheese'),
        );
        expect(resolvingView).toBeTruthy();
        expect(resolvingView).toHaveLength(2);
        // Should not call out to ORS again for the same URL.
        expect(mockFetch).toBeCalledTimes(1);
      });
    });

    describe('> state: resolved', () => {
      it('inline: should render with metadata when resolved', async () => {
        const { getByText } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="inline" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        const resolvedView = await waitForElement(() =>
          getByText('I love cheese'),
        );
        expect(resolvedView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);

        expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledTimes(1);
        expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            display: 'inline',
            status: 'resolved',
          }),
        );
      });

      it('should re-render when URL changes', async () => {
        const { getByText, rerender } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="inline" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        const resolvedView = await waitForElement(() =>
          getByText('I love cheese'),
        );
        expect(resolvedView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);

        rerender(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="inline" url="https://google.com" />
            </Provider>
          </IntlProvider>,
        );
        await waitForElement(() => getByText('I love cheese'));
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(2);
      });

      it('should re-render when store is destroyed', async () => {
        const { getByText, rerender } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="inline" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        const resolvedView = await waitForElement(() =>
          getByText('I love cheese'),
        );
        expect(resolvedView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);

        rerender(
          <IntlProvider locale="en">
            <Provider client={mockClient} storeOptions={{ initialState: {} }}>
              <Card appearance="inline" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        await waitForElement(() => getByText('I love cheese'));
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(2);
      });

      it('should not re-render when appearance changes', async () => {
        const { getByText, rerender } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="inline" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        const resolvedView = await waitForElement(() =>
          getByText('I love cheese'),
        );
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
        await waitForElement(() => getByText('I love cheese'));
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });

      it('should call onResolve if provided', async () => {
        const mockOnResolve = jest.fn();
        const { findByTestId } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card
                appearance="inline"
                url={mockUrl}
                onResolve={mockOnResolve}
              />
            </Provider>
          </IntlProvider>,
        );
        await findByTestId('inline-card-resolved-view');

        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
        expect(mockOnResolve).toBeCalled();
        expect(mockOnResolve).toBeCalledTimes(1);
      });
    });

    describe('> state: forbidden', () => {
      describe('with auth services available', () => {
        it('inline: renders the forbidden view if no access, with auth prompt', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.forbidden);
          const { getByText, container } = render(
            <Provider client={mockClient}>
              <Card appearance="inline" url={mockUrl} onError={mockOnError} />
            </Provider>,
          );
          const forbiddenLink = await waitForElement(() =>
            getByText(/Restricted content/),
          );
          const forbiddenLinkButton =
            container.querySelector('[type="button"]');
          expect(forbiddenLink).toBeTruthy();
          expect(forbiddenLinkButton).toBeTruthy();
          const forbiddenLinkButtonHTML = forbiddenLinkButton as HTMLElement;
          expect(forbiddenLinkButtonHTML!.innerText).toContain(
            'Restricted content',
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
        it('inline: renders the forbidden view if no access, no auth prompt', async () => {
          mocks.forbidden.meta.auth = [];
          mockFetch.mockImplementationOnce(async () => mocks.forbidden);
          const { getByText, container } = render(
            <Provider client={mockClient}>
              <Card appearance="inline" url={mockUrl} onError={mockOnError} />
            </Provider>,
          );
          const forbiddenLinkTruncated = mockUrl.slice(0, 5);
          const forbiddenLink = await waitForElement(() =>
            getByText(new RegExp(`${forbiddenLinkTruncated}.*?`)),
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
      describe('with auth services available', () => {
        it('inline: renders with connect flow', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
          const { findByTestId, container } = render(
            <Provider client={mockClient}>
              <Card appearance="inline" url={mockUrl} onError={mockOnError} />
            </Provider>,
          );
          const unauthorizedLink = await findByTestId('button-connect-account');
          const unauthorizedLinkButton =
            container.querySelector('[type="button"]');
          expect(unauthorizedLink).toBeTruthy();
          expect(unauthorizedLinkButton).toBeTruthy();
          expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
          expect(mockFetch).toBeCalled();
          expect(mockFetch).toBeCalledTimes(1);
          expect(mockOnError).toHaveBeenCalledWith({
            url: mockUrl,
            status: 'unauthorized',
          });
        });
      });

      describe('with auth services not available', () => {
        it('inline: renders without connect flow', async () => {
          mocks.unauthorized.meta.auth = [];
          mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
          const { getByText, container } = render(
            <Provider client={mockClient}>
              <Card appearance="inline" url={mockUrl} onError={mockOnError} />
            </Provider>,
          );
          const unauthorizedLink = await waitForElement(() =>
            getByText(mockUrl),
          );
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

      describe('with authFlow explicitly disabled', () => {
        it('inline: renders as blue link', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
          const { getByText } = render(
            <Provider client={mockClient} authFlow="disabled">
              <Card appearance="inline" url={mockUrl} onError={mockOnError} />
            </Provider>,
          );
          const dumbLink = await waitForElement(() => getByText(mockUrl));
          expect(dumbLink).toBeTruthy();
          expect(mockFetch).toBeCalled();
          expect(mockFetch).toBeCalledTimes(1);
          expect(mockOnError).toHaveBeenCalledWith({
            url: mockUrl,
            status: 'fallback',
          });
        });
      });
    });

    describe('> state: error', () => {
      it('inline: renders blue link when resolve fails', async () => {
        mockFetch.mockImplementationOnce(
          () =>
            new Promise((_resolve, reject) =>
              reject(new Error('Something went wrong')),
            ),
        );
        const { getByText } = render(
          <Provider client={mockClient}>
            <Card appearance="inline" url={mockUrl} onError={mockOnError} />
          </Provider>,
        );
        const dumbLink = await waitForElement(() => getByText(mockUrl));
        expect(dumbLink).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith({
          url: mockUrl,
          status: 'errored',
        });
      });

      it('inline: renders error card when link not found', async () => {
        mockFetch.mockImplementationOnce(async () => mocks.notFound);
        const { getByText } = render(
          <Provider client={mockClient}>
            <Card appearance="inline" url={mockUrl} onError={mockOnError} />
          </Provider>,
        );
        const errorView = await waitForElement(() =>
          getByText(/Can't find link/),
        );
        expect(errorView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith({
          url: mockUrl,
          status: 'not_found',
        });
      });
    });

    describe('> state: invalid', () => {
      it('inline: does not throw error when state is invalid', async () => {
        const storeOptions = {
          initialState: { [mockUrl]: {} },
        } as CardProviderStoreOpts;
        const { findByTestId } = render(
          <Provider client={mockClient} storeOptions={storeOptions}>
            <Card appearance="inline" url={mockUrl} />
          </Provider>,
        );

        const link = await findByTestId('inline-card-resolved-view');
        expect(link).toBeTruthy();
      });
    });
  });

  describe('render method: withData', () => {
    describe('> state: resolved', () => {
      it('inline: renders successfully with data', async () => {
        const { getByText } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card
                appearance="inline"
                url={mockUrl}
                data={mocks.success.data}
              />
            </Provider>
          </IntlProvider>,
        );
        const resolvedView = await waitForElement(() =>
          getByText('I love cheese'),
        );
        expect(resolvedView).toBeTruthy();
      });
    });
  });
});
