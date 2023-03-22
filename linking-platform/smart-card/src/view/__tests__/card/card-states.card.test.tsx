jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock(
  'react-transition-group/Transition',
  () => (data: any) => data.children,
);
jest.doMock('../../../utils/analytics/analytics');

import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import { CardClient, CardProviderStoreOpts } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { Card } from '../../Card';
import { Provider } from '../../..';
import { fakeFactory, mocks } from '../../../utils/mocks';
import { IntlProvider } from 'react-intl-next';

mockSimpleIntersectionObserver();

describe('smart-card: card states, block', () => {
  const mockOnError = jest.fn();
  const mockOnResolve = jest.fn();
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
      it('block: should render loading state initially', async () => {
        const { getByTestId } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="block" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        const loadingView = await waitFor(() =>
          getByTestId('block-card-resolving-view'),
        );
        expect(loadingView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });
    });

    describe('> state: resolved', () => {
      it('block: should render with metadata when resolved', async () => {
        const { getByText } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="block" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        const resolvedViewName = await waitFor(() =>
          getByText('I love cheese'),
        );
        const resolvedViewDescription = await waitFor(() =>
          getByText('Here is your serving of cheese: 🧀'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(resolvedViewDescription).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });

      it('block: should render with metadata when resolved and call onResolve if provided', async () => {
        const { getByText } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card
                appearance="block"
                url={mockUrl}
                onResolve={mockOnResolve}
              />
            </Provider>
          </IntlProvider>,
        );
        const resolvedViewName = await waitFor(() =>
          getByText('I love cheese'),
        );
        const resolvedViewDescription = await waitFor(() =>
          getByText('Here is your serving of cheese: 🧀'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(resolvedViewDescription).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
        expect(mockOnResolve).toBeCalled();
        expect(mockOnResolve).toBeCalledTimes(1);
      });

      it('should re-render when URL changes', async () => {
        let resolvedView = null;
        const { getByText, rerender } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="block" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        resolvedView = await waitFor(() => getByText('I love cheese'));
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
        resolvedView = await waitFor(() => getByText('I love cheese'));
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(2);
      });

      it('should not re-render when appearance changes', async () => {
        let resolvedView = null;
        const { getByText, rerender } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="block" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        resolvedView = await waitFor(() => getByText('I love cheese'));
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
        resolvedView = await waitFor(() => getByText('I love cheese'));
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });
    });

    describe('> state: forbidden', () => {
      describe('with auth services available', () => {
        it('block: renders the forbidden view if no access, with auth prompt', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.forbidden);
          const { getByText, getByTestId, container } = render(
            <Provider client={mockClient}>
              <Card appearance="block" url={mockUrl} onError={mockOnError} />
            </Provider>,
          );
          const frame = await waitFor(() =>
            getByTestId('block-card-forbidden-view'),
          );
          expect(frame).toBeTruthy();
          const forbiddenLink = await waitFor(() => getByText(mockUrl));
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
      });

      describe('with no auth services available', () => {
        it('block: renders the forbidden view if no access, no auth prompt', async () => {
          mockFetch.mockImplementationOnce(
            async () => mocks.forbiddenWithNoAuth,
          );
          const { getByText, getByTestId, container } = render(
            <Provider client={mockClient}>
              <Card appearance="block" url={mockUrl} onError={mockOnError} />
            </Provider>,
          );
          const frame = await waitFor(() =>
            getByTestId('block-card-forbidden-view'),
          );
          expect(frame).toBeTruthy();
          const forbiddenLink = await waitFor(() => getByText(mockUrl));
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
        it('block: renders with connect flow', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
          const { getByText, getByTestId } = render(
            <Provider client={mockClient}>
              <Card appearance="block" url={mockUrl} onError={mockOnError} />
            </Provider>,
          );
          const frame = await waitFor(() =>
            getByTestId('block-card-unauthorized-view'),
          );
          expect(frame).toBeTruthy();
          const unauthorizedLink = await waitFor(() => getByText(mockUrl));
          expect(unauthorizedLink).toBeTruthy();
          const unauthorizedLinkButton = getByTestId('button-connect-account');
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
        it('block: renders without connect flow', async () => {
          mockFetch.mockImplementationOnce(
            async () => mocks.unauthorizedWithNoAuth,
          );
          const { getByText, getByTestId, container } = render(
            <Provider client={mockClient}>
              <Card appearance="block" url={mockUrl} onError={mockOnError} />
            </Provider>,
          );
          const frame = await waitFor(() =>
            getByTestId('block-card-unauthorized-view'),
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

      describe('with authFlow explicitly disabled', () => {
        it('block: renders as blue link', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
          const { getByTestId } = render(
            <Provider client={mockClient} authFlow="disabled">
              <Card
                testId="disabled-authFlow-card"
                appearance="block"
                url={mockUrl}
                onError={mockOnError}
              />
            </Provider>,
          );
          const dumbLink = await waitFor(() =>
            getByTestId('disabled-authFlow-card-fallback'),
          );
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
      it('block: renders error card when resolve fails', async () => {
        mockFetch.mockImplementationOnce(() =>
          Promise.reject(new Error('Something went wrong')),
        );
        const { findByText, findByTestId } = render(
          <Provider client={mockClient}>
            <Card appearance="block" url={mockUrl} onError={mockOnError} />
          </Provider>,
        );
        const frame = await findByTestId('block-card-errored-view');
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

      it('block: renders not found card when link not found', async () => {
        mockFetch.mockImplementationOnce(async () => mocks.notFound);
        const { getByText, getByTestId } = render(
          <Provider client={mockClient}>
            <Card appearance="block" url={mockUrl} onError={mockOnError} />
          </Provider>,
        );
        const frame = await waitFor(() =>
          getByTestId('block-card-not-found-view'),
        );
        expect(frame).toBeTruthy();
        const link = await waitFor(() => getByText(mockUrl));
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
          <Provider client={mockClient} storeOptions={storeOptions}>
            <Card appearance="block" url={mockUrl} />
          </Provider>,
        );

        const link = await findByTestId('block-card-resolved-view');
        expect(link).toBeTruthy();
      });
    });
  });

  describe('render method: withUrl and new FF', () => {
    describe('> state: loading', () => {
      it('block: should render loading state initially', async () => {
        const { getByTestId } = render(
          <IntlProvider locale="en">
            <Provider
              client={mockClient}
              featureFlags={{ enableFlexibleBlockCard: true }}
            >
              <Card appearance="block" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        const loadingView = await waitFor(() =>
          getByTestId('smart-block-resolving-view'),
        );
        expect(loadingView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });
    });

    describe('> state: resolved', () => {
      it('block: should render with metadata when resolved', async () => {
        const { getByText } = render(
          <IntlProvider locale="en">
            <Provider
              client={mockClient}
              featureFlags={{ enableFlexibleBlockCard: true }}
            >
              <Card appearance="block" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        const resolvedViewName = await waitFor(() =>
          getByText('I love cheese'),
        );
        const resolvedViewDescription = await waitFor(() =>
          getByText('Here is your serving of cheese: 🧀'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(resolvedViewDescription).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });

      it('block: should render with metadata when resolved and call onResolve if provided', async () => {
        const { getByText } = render(
          <IntlProvider locale="en">
            <Provider
              client={mockClient}
              featureFlags={{ enableFlexibleBlockCard: true }}
            >
              <Card
                appearance="block"
                url={mockUrl}
                onResolve={mockOnResolve}
              />
            </Provider>
          </IntlProvider>,
        );
        const resolvedViewName = await waitFor(() =>
          getByText('I love cheese'),
        );
        const resolvedViewDescription = await waitFor(() =>
          getByText('Here is your serving of cheese: 🧀'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(resolvedViewDescription).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
        expect(mockOnResolve).toBeCalled();
        expect(mockOnResolve).toBeCalledTimes(1);
      });

      it('should re-render when URL changes', async () => {
        let resolvedView = null;
        const { getByText, rerender } = render(
          <IntlProvider locale="en">
            <Provider
              client={mockClient}
              featureFlags={{ enableFlexibleBlockCard: true }}
            >
              <Card appearance="block" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        resolvedView = await waitFor(() => getByText('I love cheese'));
        expect(resolvedView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);

        rerender(
          <IntlProvider locale="en">
            <Provider
              client={mockClient}
              featureFlags={{ enableFlexibleBlockCard: true }}
            >
              <Card appearance="block" url="https://google.com" />
            </Provider>
          </IntlProvider>,
        );
        resolvedView = await waitFor(() => getByText('I love cheese'));
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(2);
      });

      it('should not re-render when appearance changes', async () => {
        let resolvedView = null;
        const { getByText, rerender } = render(
          <IntlProvider locale="en">
            <Provider
              client={mockClient}
              featureFlags={{ enableFlexibleBlockCard: true }}
            >
              <Card appearance="block" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        resolvedView = await waitFor(() => getByText('I love cheese'));
        expect(resolvedView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);

        rerender(
          <IntlProvider locale="en">
            <Provider
              client={mockClient}
              featureFlags={{ enableFlexibleBlockCard: true }}
            >
              <Card appearance="block" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        resolvedView = await waitFor(() => getByText('I love cheese'));
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });
    });

    describe('> state: forbidden', () => {
      describe('with auth services available', () => {
        it('block: renders the forbidden view if no access, with auth prompt', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.forbidden);
          const { getByText, getByTestId } = render(
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
          const forbiddenLink = await waitFor(() => getByText(mockUrl));
          expect(forbiddenLink).toBeTruthy();
          const forbiddenLinkButton = await waitFor(() =>
            getByTestId('smart-action-connect-other-account'),
          );
          expect(forbiddenLinkButton).toBeTruthy();
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
        it('block: renders the forbidden view if no access, no auth prompt', async () => {
          mockFetch.mockImplementationOnce(
            async () => mocks.forbiddenWithNoAuth,
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
          const forbiddenLink = await waitFor(() => getByText(mockUrl));
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
        it('block: renders with connect flow', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
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
          const unauthorizedLinkButton = await waitFor(() =>
            getByTestId('smart-action-connect-account'),
          );
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
        it('block: renders without connect flow', async () => {
          mockFetch.mockImplementationOnce(
            async () => mocks.unauthorizedWithNoAuth,
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

      describe('with authFlow explicitly disabled', () => {
        it('block: renders as blue link', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
          const { getByText } = render(
            <Provider client={mockClient} authFlow="disabled">
              <Card appearance="block" url={mockUrl} onError={mockOnError} />
            </Provider>,
          );
          const dumbLink = await waitFor(() => getByText(mockUrl));
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
      it('block: renders error card when resolve fails', async () => {
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

      it('block: renders not found card when link not found', async () => {
        mockFetch.mockImplementationOnce(async () => mocks.notFound);
        const { getByText, getByTestId } = render(
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
        const link = await waitFor(() => getByText(mockUrl));
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
          <Provider client={mockClient} storeOptions={storeOptions}>
            <Card appearance="block" url={mockUrl} />
          </Provider>,
        );

        const link = await findByTestId('block-card-resolved-view');
        expect(link).toBeTruthy();
      });
    });
  });

  describe('render method: withData', () => {
    describe('> state: resolved', () => {
      it('block: renders successfully with data', async () => {
        const { getByText } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card
                appearance="block"
                url={mockUrl}
                data={mocks.success.data}
              />
            </Provider>
          </IntlProvider>,
        );
        const resolvedViewName = await waitFor(() =>
          getByText('I love cheese'),
        );
        const resolvedViewDescription = await waitFor(() =>
          getByText('Here is your serving of cheese: 🧀'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(resolvedViewDescription).toBeTruthy();
      });
    });
  });
});
