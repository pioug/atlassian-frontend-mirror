import { mockEvents } from './_mocks';

let mockRequest = jest.fn();
jest.mock('../../client/api', () => ({
  request: (...args: any) => mockRequest(args[0], args[1], args[2]),
}));
jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) =>
  data.children,
);
jest.doMock('../../utils/analytics', () => mockEvents);

import React from 'react';
import { TestErrorBoundary } from './_boundary';
import { Card } from '../Card';
import { Provider } from '../..';
import { render, waitForElement, cleanup } from '@testing-library/react';
import { mocks } from '../../utils/mocks';
import { APIError } from '../../client/errors';

describe('smart-card: error analytics', () => {
  let mockWindowOpen: jest.Mock;
  let mockUrl: string;

  beforeEach(() => {
    mockRequest = jest.fn();
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
    mockRequest.mockResolvedValue([
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
    expect(mockEvents.instrumentEvent).toHaveBeenCalledWith(
      expect.any(String),
      'fallback',
      undefined,
      undefined,
      new APIError('fallback', 'https://my', 'received bad request'),
    );
    expect(mockEvents.unresolvedEvent).toHaveBeenCalled();
  });

  it('should render unauthorized on ResolveAuthError', async () => {
    mockRequest.mockResolvedValue([
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
    expect(mockEvents.instrumentEvent).toHaveBeenCalledWith(
      expect.any(String),
      'unauthorized',
      'provider-not-found',
      undefined,
      undefined,
    );
    expect(mockEvents.unresolvedEvent).toHaveBeenCalled();
  });

  it('should throw fatal error on ResolveUnsupportedError', async () => {
    mockRequest.mockResolvedValue([
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
  });

  it('should throw error on ResolveFailedError', async () => {
    mockRequest.mockResolvedValue([
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
    expect(mockEvents.instrumentEvent).toHaveBeenCalledWith(
      expect.any(String),
      'errored',
      undefined,
      undefined,
      new APIError('error', 'https://my', 'received failure error'),
    );
    expect(mockEvents.unresolvedEvent).toHaveBeenCalled();
  });

  it('should throw error on ResolveTimeoutError', async () => {
    mockRequest.mockResolvedValue([
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
    expect(mockEvents.instrumentEvent).toHaveBeenCalledWith(
      expect.any(String),
      'errored',
      undefined,
      undefined,
      new APIError('error', 'https://my', 'received timeout error'),
    );
    expect(mockEvents.unresolvedEvent).toHaveBeenCalled();
  });

  it('should throw error on InternalServerError', async () => {
    mockRequest.mockResolvedValue([
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
    expect(mockEvents.instrumentEvent).toHaveBeenCalledWith(
      expect.any(String),
      'errored',
      undefined,
      undefined,
      new APIError('error', 'https://my', 'received internal server error'),
    );
    expect(mockEvents.unresolvedEvent).toHaveBeenCalled();
  });

  it('should throw fatal error on unexpected err', async () => {
    mockRequest.mockResolvedValue([
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
  });

  it('should render with current data on unexpected err', async () => {
    mockRequest.mockResolvedValue([
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
              lastUpdatedAt: Date.now(),
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
    expect(mockEvents.instrumentEvent).toBeCalledWith(
      expect.any(String),
      'resolved',
      'd1',
      undefined,
      undefined,
    );
    expect(mockEvents.resolvedEvent).toHaveBeenCalledTimes(1);
    expect(mockEvents.uiRenderSuccessEvent).toBeCalledWith('inline', 'd1');
  });
});
