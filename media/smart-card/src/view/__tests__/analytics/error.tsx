import './error.mock';
import '../../__mocks__/intersection-observer.mock';
import { JsonLd } from 'json-ld-types';
import React from 'react';
import { TestErrorBoundary } from '../_boundary';
import { Card } from '../../Card';
import { Provider } from '../../..';
import { render, waitForElement, cleanup } from '@testing-library/react';
import { mocks } from '../../../utils/mocks';
import { APIError } from '@atlaskit/linking-common';
import { CardClient } from '@atlaskit/link-provider';
import * as analytics from '../../../utils/analytics';

describe('smart-card: error analytics', () => {
  let mockWindowOpen: jest.Mock;
  let mockUrl: string;

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
    const erroredLink = await waitForElement(
      () => getByTestId('erroredLink-fallback-view'),
      { timeout: 10000 },
    );

    expect(erroredLink).toBeTruthy();
    expect(analytics.unresolvedEvent).toHaveBeenCalledWith(
      expect.any(String),
      'fallback',
      undefined,
      undefined,
      undefined,
      new APIError('fallback', 'https://my', 'received bad request'),
    );
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
    const erroredLink = await waitForElement(
      () => getByTestId('erroredLink-unauthorized-view'),
      { timeout: 10000 },
    );

    expect(erroredLink).toBeTruthy();
    expect(analytics.unresolvedEvent).toHaveBeenCalledWith(
      expect.any(String),
      'unauthorized',
      'provider-not-found',
      undefined,
      undefined,
      undefined,
    );
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
    const errorBoundary = await waitForElement(
      () => getByTestId('error-boundary'),
      { timeout: 10000 },
    );

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
    const erroredLink = await waitForElement(
      () => getByTestId('erroredLink-errored-view'),
      { timeout: 10000 },
    );

    expect(erroredLink).toBeTruthy();
    expect(analytics.unresolvedEvent).toHaveBeenCalledWith(
      expect.any(String),
      'errored',
      undefined,
      undefined,
      undefined,
      new APIError('error', 'https://my', 'received failure error'),
    );
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
    const erroredLink = await waitForElement(
      () => getByTestId('erroredLink-errored-view'),
      { timeout: 10000 },
    );

    expect(erroredLink).toBeTruthy();
    expect(analytics.unresolvedEvent).toHaveBeenCalledWith(
      expect.any(String),
      'errored',
      undefined,
      undefined,
      undefined,
      new APIError('error', 'https://my', 'received timeout error'),
    );
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
    const erroredLink = await waitForElement(
      () => getByTestId('erroredLink-errored-view'),
      { timeout: 10000 },
    );

    expect(erroredLink).toBeTruthy();
    expect(analytics.unresolvedEvent).toHaveBeenCalledWith(
      expect.any(String),
      'errored',
      undefined,
      undefined,
      undefined,
      new APIError('error', 'https://my', 'received internal server error'),
    );
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
    const errorBoundary = await waitForElement(
      () => getByTestId('error-boundary'),
      { timeout: 10000 },
    );

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
    const resolvedView = await waitForElement(
      () => getByTestId('erroredLink-resolved-view'),
      { timeout: 10000 },
    );

    const resolvedCard = getByRole('button');
    expect(resolvedView).toBeTruthy();
    expect(resolvedCard).toBeTruthy();
    expect(onError).not.toHaveBeenCalled();
    expect(analytics.resolvedEvent).toBeCalledWith(
      expect.any(String),
      'd1',
      'object-provider',
      undefined,
    );
    expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);
    expect(analytics.uiRenderSuccessEvent).toBeCalledWith(
      'inline',
      'resolved',
      'd1',
      'object-provider',
    );
  });
});
