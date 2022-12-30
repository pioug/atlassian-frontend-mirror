import './error.mock';
import '../../__mocks__/intersection-observer.mock';
import { JsonLd } from 'json-ld-types';
import React from 'react';
import { TestErrorBoundary } from '../_boundary';
import { Card } from '../../Card';
import { Provider } from '../../..';
import { render, waitFor, cleanup } from '@testing-library/react';
import { mocks } from '../../../utils/mocks';
import { APIError } from '@atlaskit/linking-common';
import { CardClient } from '@atlaskit/link-provider';
import * as analytics from '../../../utils/analytics';
import * as lazyComponent from '../../CardWithUrl/component-lazy/index';
import { ChunkLoadError } from '../../../utils/__tests__/index.test';

describe('smart-card: error analytics', () => {
  let mockWindowOpen: jest.Mock;
  let mockUrl: string;
  const mockedLazyComponent = jest.spyOn(lazyComponent, 'default');

  beforeEach(() => {
    mockWindowOpen = jest.fn();
    mockUrl = 'https://my.url';
    /// @ts-ignore
    global.open = mockWindowOpen;
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('should fallback on ResolveBadRequestError', async () => {
    class MockClient extends CardClient {
      async fetchData(url: string): Promise<JsonLd.Response> {
        throw new APIError(
          'fallback',
          new URL(url).hostname,
          'received bad request',
          'ResolveBadRequestError',
        );
      }
    }
    const client = new MockClient();

    const { getByTestId } = render(
      <Provider client={client}>
        <Card testId="erroredLink" appearance="inline" url={mockUrl} />
      </Provider>,
    );
    const erroredLink = await waitFor(
      () => getByTestId('erroredLink-fallback-view'),
      { timeout: 10000 },
    );

    expect(erroredLink).toBeTruthy();
    expect(analytics.unresolvedEvent).toHaveBeenCalledWith({
      id: expect.any(String),
      status: 'fallback',
      error: new APIError('fallback', 'https://my', 'received bad request'),
    });
    expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
  });

  it('should render unauthorized on ResolveAuthError', async () => {
    class MockClient extends CardClient {
      async fetchData(url: string): Promise<JsonLd.Response> {
        throw new APIError(
          'auth',
          new URL(url).hostname,
          'received bad request',
          'ResolveAuthError',
        );
      }
    }
    const client = new MockClient();
    const { getByTestId } = render(
      <Provider client={client}>
        <Card testId="erroredLink" appearance="inline" url={mockUrl} />
      </Provider>,
    );
    const erroredLink = await waitFor(
      () => getByTestId('erroredLink-unauthorized-view'),
      { timeout: 10000 },
    );

    expect(erroredLink).toBeTruthy();
    expect(analytics.unresolvedEvent).toHaveBeenCalledWith({
      id: expect.any(String),
      status: 'unauthorized',
      definitionId: 'provider-not-found',
    });
    expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
  });

  it('should throw fatal error on ResolveUnsupportedError', async () => {
    class MockClient extends CardClient {
      async fetchData(url: string): Promise<JsonLd.Response> {
        throw new APIError(
          'fatal',
          new URL(url).hostname,
          'received unsupported error',
          'ResolveUnsupportedError',
        );
      }
    }
    const client = new MockClient();
    const onError = jest.fn();
    const { getByTestId } = render(
      <Provider client={client}>
        <TestErrorBoundary onError={onError}>
          <Card testId="erroredLink" appearance="inline" url={mockUrl} />
        </TestErrorBoundary>
      </Provider>,
    );
    const errorBoundary = await waitFor(() => getByTestId('error-boundary'), {
      timeout: 10000,
    });

    expect(errorBoundary).toBeTruthy();
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'fatal',
        name: 'APIError',
        message: 'received unsupported error',
      }),
      expect.objectContaining({
        componentStack: expect.any(String),
      }),
    );
    expect(analytics.unresolvedEvent).not.toHaveBeenCalled();
  });

  it('should throw error on ResolveFailedError', async () => {
    class MockClient extends CardClient {
      async fetchData(url: string): Promise<JsonLd.Response> {
        throw new APIError(
          'error',
          new URL(url).hostname,
          'received failure error',
          'ResolveFailedError',
        );
      }
    }
    const client = new MockClient();
    const { getByTestId } = render(
      <Provider client={client}>
        <Card testId="erroredLink" appearance="inline" url={mockUrl} />
      </Provider>,
    );
    const erroredLink = await waitFor(
      () => getByTestId('erroredLink-errored-view'),
      { timeout: 10000 },
    );

    expect(erroredLink).toBeTruthy();
    expect(analytics.unresolvedEvent).toHaveBeenCalledWith({
      id: expect.any(String),
      status: 'errored',
      error: new APIError('error', 'https://my', 'received failure error'),
    });
    expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
  });

  it('should throw error on ResolveTimeoutError', async () => {
    class MockClient extends CardClient {
      async fetchData(url: string): Promise<JsonLd.Response> {
        throw new APIError(
          'error',
          new URL(url).hostname,
          'received timeout error',
          'ResolveTimeoutError',
        );
      }
    }
    const client = new MockClient();
    const { getByTestId } = render(
      <Provider client={client}>
        <Card testId="erroredLink" appearance="inline" url={mockUrl} />
      </Provider>,
    );
    const erroredLink = await waitFor(
      () => getByTestId('erroredLink-errored-view'),
      { timeout: 10000 },
    );

    expect(erroredLink).toBeTruthy();
    expect(analytics.unresolvedEvent).toHaveBeenCalledWith({
      id: expect.any(String),
      status: 'errored',
      error: new APIError('error', 'https://my', 'received timeout error'),
    });
    expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
  });

  it('should throw error on InternalServerError', async () => {
    class MockClient extends CardClient {
      async fetchData(url: string): Promise<JsonLd.Response> {
        throw new APIError(
          'error',
          new URL(url).hostname,
          'received internal server error',
          'InternalServerError',
        );
      }
    }
    const client = new MockClient();
    const { getByTestId } = render(
      <Provider client={client}>
        <Card testId="erroredLink" appearance="inline" url={mockUrl} />
      </Provider>,
    );
    const erroredLink = await waitFor(
      () => getByTestId('erroredLink-errored-view'),
      { timeout: 10000 },
    );

    expect(erroredLink).toBeTruthy();
    expect(analytics.unresolvedEvent).toHaveBeenCalledWith({
      id: expect.any(String),
      status: 'errored',
      error: new APIError(
        'error',
        'https://my',
        'received internal server error',
      ),
    });
    expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
  });

  it('should throw fatal error on unexpected err', async () => {
    class MockClient extends CardClient {
      async fetchData(url: string): Promise<JsonLd.Response> {
        throw new APIError(
          'fatal',
          new URL(url).hostname,
          'received internal server error',
          'InternalServerError',
        );
      }
    }
    const client = new MockClient();
    const onError = jest.fn();
    const { getByTestId } = render(
      <Provider client={client}>
        <TestErrorBoundary onError={onError}>
          <Card testId="erroredLink" appearance="inline" url={mockUrl} />
        </TestErrorBoundary>
      </Provider>,
    );
    const errorBoundary = await waitFor(() => getByTestId('error-boundary'), {
      timeout: 10000,
    });

    expect(errorBoundary).toBeTruthy();
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'fatal',
        name: 'APIError',
      }),
      expect.objectContaining({
        componentStack: expect.any(String),
      }),
    );
    expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
  });

  it('should render with current data on unexpected err', async () => {
    class MockClient extends CardClient {
      async fetchData(url: string): Promise<JsonLd.Response> {
        throw new APIError(
          'fatal',
          new URL(url).hostname,
          'received internal server error',
          'InternalServerError',
        );
      }
    }
    const client = new MockClient();
    const onError = jest.fn();
    const { getByTestId, getByRole } = render(
      <Provider
        client={client}
        storeOptions={{
          initialState: {
            [mockUrl]: {
              status: 'resolved' as const,
              details: mocks.success,
            },
          },
        }}
      >
        <TestErrorBoundary onError={onError}>
          <Card testId="erroredLink" appearance="inline" url={mockUrl} />
        </TestErrorBoundary>
      </Provider>,
    );
    const resolvedView = await waitFor(
      () => getByTestId('erroredLink-resolved-view'),
      { timeout: 10000 },
    );

    const resolvedCard = getByRole('button');
    expect(resolvedView).toBeTruthy();
    expect(resolvedCard).toBeTruthy();
    expect(onError).not.toHaveBeenCalled();
    expect(analytics.resolvedEvent).toBeCalledWith({
      id: expect.any(String),
      definitionId: 'd1',
      extensionKey: 'object-provider',
    });
    expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);
    expect(analytics.uiRenderSuccessEvent).toBeCalledWith({
      display: 'inline',
      status: 'resolved',
      definitionId: 'd1',
      extensionKey: 'object-provider',
    });
  });

  it('should throw ChunkLoadError and emit chunkLoadFailed event', async () => {
    const chunkLoadError = new ChunkLoadError();
    mockedLazyComponent.mockImplementation(() => {
      throw chunkLoadError;
    });

    const onError = jest.fn();
    class MockClient extends CardClient {
      async fetchData(url: string): Promise<JsonLd.Response> {
        return mocks.success;
      }
    }
    const client = new MockClient();
    const { getByTestId } = render(
      <Provider client={client}>
        <TestErrorBoundary onError={onError}>
          <Card appearance="inline" url={mockUrl} />
        </TestErrorBoundary>
      </Provider>,
    );

    await waitFor(() => getByTestId('error-boundary'));
    await waitFor(() =>
      expect(analytics.chunkloadFailedEvent).toHaveBeenCalledTimes(1),
    );
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        name: chunkLoadError.name,
      }),
      expect.objectContaining({
        componentStack: expect.any(String),
      }),
    );
  });
});
