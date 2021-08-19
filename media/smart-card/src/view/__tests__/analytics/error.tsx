import './error.mock';

import React from 'react';
import { asMockFunction } from '@atlaskit/media-test-helpers/jestHelpers';
import { TestErrorBoundary } from '../_boundary';
import { Card } from '../../Card';
import { Provider } from '../../..';
import { render, waitForElement, cleanup } from '@testing-library/react';
import { mocks } from '../../../utils/mocks';
import { request } from '../../../client/api';
import { APIError } from '../../../client/errors';
import * as analytics from '../../../utils/analytics';

describe('smart-card: error analytics', () => {
  let mockWindowOpen: jest.Mock;
  let mockUrl: string;

  beforeEach(() => {
    asMockFunction(request).mockReset();
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
    asMockFunction(request).mockResolvedValue([
      {
        status: 200,
        error: {
          type: 'ResolveBadRequestError',
          message: 'received bad request',
        },
      },
    ]);

    const { getByTestId } = render(
      <Provider>
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
    asMockFunction(request).mockResolvedValue([
      {
        status: 200,
        error: { type: 'ResolveAuthError' },
      },
    ]);

    const { getByTestId } = render(
      <Provider>
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
    asMockFunction(request).mockResolvedValue([
      {
        status: 200,
        error: {
          type: 'ResolveUnsupportedError',
          message: 'received unsupported error',
        },
      },
    ]);
    const onError = jest.fn();

    const { getByTestId } = render(
      <Provider>
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
    asMockFunction(request).mockResolvedValue([
      {
        status: 200,
        error: {
          type: 'ResolveFailedError',
          message: 'received failure error',
        },
      },
    ]);

    const { getByTestId } = render(
      <Provider>
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
    asMockFunction(request).mockResolvedValue([
      {
        status: 200,
        error: {
          type: 'ResolveTimeoutError',
          message: 'received timeout error',
        },
      },
    ]);

    const { getByTestId } = render(
      <Provider>
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
    asMockFunction(request).mockResolvedValue([
      {
        status: 200,
        error: {
          type: 'InternalServerError',
          message: 'received internal server error',
        },
      },
    ]);

    const { getByTestId } = render(
      <Provider>
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
    asMockFunction(request).mockResolvedValue([
      {
        cats: 'sleep a lot',
      },
    ]);

    const onError = jest.fn();

    const { getByTestId } = render(
      <Provider>
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
    asMockFunction(request).mockResolvedValue([
      {
        cats: 'sleep a lot',
      },
    ]);

    const onError = jest.fn();

    const { getByTestId, getByRole } = render(
      <Provider
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
      'd1',
      'object-provider',
    );
  });
});
