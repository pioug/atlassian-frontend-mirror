let mockRequest = jest.fn();
jest.mock('../api', () => ({
  ...jest.requireActual<Object>('../api'),
  request: (...args: any) => mockRequest(...args),
}));

import { mocks } from '../../utils/mocks';
import SmartCardClient from '..';
import { isSuccessfulResponse, SuccessResponse } from '../types/responses';
import { APIError } from '../errors';
import { NetworkError } from '../api';
import { flushPromises } from '@atlaskit/media-test-helpers';

// Mock response quick-references:
const errorResponse = {
  status: 500,
  error: {
    type: 'ResolveFailedError',
    message: 'received failure error',
  },
};
const successfulResponse = { status: 200, body: mocks.success };
const notFoundResponse = { status: 200, body: mocks.notFound };
const unauthorizedResponse = { status: 200, body: mocks.unauthorized };

describe('Smart Card: Client', () => {
  beforeEach(() => {
    mockRequest = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('successfully sets up client with passed environment', async () => {
    mockRequest.mockImplementationOnce(async () => [successfulResponse]);
    const client = new SmartCardClient('stg');
    const resourceUrl = 'https://i.love.cheese';
    const response = await client.fetchData('https://i.love.cheese');
    expect(mockRequest).toBeCalled();
    expect(mockRequest).toBeCalledWith(
      'post',
      expect.stringMatching(/.*?stg.*?\/resolve\/batch/),
      [
        {
          resourceUrl,
        },
      ],
    );
    expect(response).toBe(mocks.success);
  });

  it('successfully deduplicates requests made in batches in same execution frame', async () => {
    const hostname = 'https://www.google.com';

    // Map the URLs sent by DataLoader to their respective responses.
    async function mockRequestFn(_method: string, _url: string, data?: any) {
      return data.map(({ resourceUrl }: any) => {
        const key: keyof typeof mocks = resourceUrl.split(`${hostname}/`)[1];
        return { status: 200, body: mocks[key] };
      });
    }

    mockRequest.mockImplementationOnce(mockRequestFn);
    const client = new SmartCardClient('stg');
    const [responseFirst, responseSecond, responseThird] = await Promise.all([
      // NOTE: send in _two_ of the same URL
      client.fetchData(`${hostname}/success`),
      client.fetchData(`${hostname}/success`),
      client.fetchData(`${hostname}/notFound`),
    ]);
    expect(mockRequest).toBeCalled();
    expect(mockRequest).toBeCalledWith(
      'post',
      expect.stringMatching(/.*?stg.*?\/resolve\/batch/),
      [
        // NOTE: we only expect _one_ of the duplicated URLs to actually be sent to the backend
        {
          resourceUrl: `${hostname}/success`,
        },
        {
          resourceUrl: `${hostname}/notFound`,
        },
      ],
    );

    // NOTE: we still expect all three responses to be the same
    expect(responseFirst).toBe(mocks.success);
    expect(responseSecond).toBe(mocks.success);
    expect(responseThird).toBe(mocks.notFound);
  });

  it('successfully batches requests in same execution frame', async () => {
    mockRequest.mockImplementationOnce(async () => [
      successfulResponse,
      unauthorizedResponse,
      notFoundResponse,
    ]);
    const client = new SmartCardClient('stg');
    const hostname = 'https://www.google.com';
    const [responseFirst, responseSecond, responseThird] = await Promise.all([
      client.fetchData(`${hostname}/1`),
      client.fetchData(`${hostname}/2`),
      client.fetchData(`${hostname}/3`),
    ]);
    expect(mockRequest).toBeCalled();
    expect(mockRequest).toBeCalledWith(
      'post',
      expect.stringMatching(/.*?stg.*?\/resolve\/batch/),
      [
        {
          resourceUrl: `${hostname}/1`,
        },
        {
          resourceUrl: `${hostname}/2`,
        },
        {
          resourceUrl: `${hostname}/3`,
        },
      ],
    );
    expect(responseFirst).toBe(mocks.success);
    expect(responseSecond).toBe(mocks.unauthorized);
    expect(responseThird).toBe(mocks.notFound);
  });

  it('should throttle batch requests', async () => {
    jest.useFakeTimers();
    mockRequest.mockResolvedValue([
      successfulResponse,
      successfulResponse,
      successfulResponse,
    ]);

    const client = new SmartCardClient('stg');
    const hostname = 'https://www.google.com';
    Promise.all([
      client.fetchData(`${hostname}/1`),
      client.fetchData(`${hostname}/2`),
      client.fetchData(`${hostname}/3`),
    ]);

    await flushPromises();
    jest.runOnlyPendingTimers();

    Promise.all([
      client.fetchData(`${hostname}/4`),
      client.fetchData(`${hostname}/5`),
      client.fetchData(`${hostname}/6`),
    ]);

    await flushPromises();

    expect(mockRequest).toBeCalledTimes(1);
    expect(mockRequest.mock.calls[0][2]).toHaveLength(3);

    jest.advanceTimersToNextTimer();
    await flushPromises();

    expect(mockRequest).toBeCalledTimes(2);
  });

  it('should handle errors in /batch endpoint', async () => {
    expect.assertions(2);
    mockRequest.mockImplementationOnce(async () =>
      Promise.reject({
        status: 400,
        error: 'some-error',
        message: 'error-message',
      }),
    );
    const client = new SmartCardClient('stg');
    const resourceUrl = 'https://i.love.cheese';
    try {
      await client.fetchData(resourceUrl);
    } catch (error) {
      expect(error).toBeInstanceOf(APIError);
      expect(error).toEqual(
        expect.objectContaining({
          kind: 'fatal',
          hostname: 'i.love.cheese',
          type: 'UnexpectedError',
          name: 'APIError',
        }),
      );
    }
  });

  it('should return fallback error when error is a network error', async () => {
    expect.assertions(2);
    mockRequest.mockImplementationOnce(async () =>
      Promise.reject(new NetworkError('some-network-error')),
    );
    const client = new SmartCardClient('stg');
    const resourceUrl = 'https://i.love.cheese';
    try {
      await client.fetchData(resourceUrl);
    } catch (error) {
      expect(error).toBeInstanceOf(APIError);
      expect(error.kind).toEqual('fallback');
    }
  });

  it('postData()', async () => {
    const client = new SmartCardClient('stg');

    client.postData({
      action: {
        type: '',
        payload: {
          id: '',
        },
      },
      key: '',
      context: '',
    });
    expect(mockRequest).toBeCalled();
    expect(mockRequest).toBeCalledWith(
      'post',
      expect.stringMatching(/.*?stg.*?\/invoke/),
      {
        action: {
          type: '',
          payload: {
            id: '',
          },
        },
        key: '',
        context: '',
      },
    );
  });

  describe('prefetchData', () => {
    it('successfully triggers prefetching of data for multiple URLs', async () => {
      mockRequest.mockImplementationOnce(async () => [
        successfulResponse,
        unauthorizedResponse,
        notFoundResponse,
      ]);

      const hostname = 'https://www.google.com';
      const client = new SmartCardClient('stg');

      const responses = await Promise.all([
        client.prefetchData(`${hostname}/1`),
        client.prefetchData(`${hostname}/2`),
        client.prefetchData(`${hostname}/3`),
      ]);

      expect(responses).toEqual([
        mocks.success,
        mocks.unauthorized,
        mocks.notFound,
      ]);
      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest.mock.calls.shift()).toMatchSnapshot('initial request');
    });

    it('successfully triggers prefetching of data with exponential backoff for an errored URL which recovers', async () => {
      mockRequest.mockImplementationOnce(async () => [
        successfulResponse,
        unauthorizedResponse,
        errorResponse,
      ]);
      // Fail on 1st retry attempt.
      mockRequest.mockImplementationOnce(async () => [errorResponse]);
      // Succeed on 2nd retry attempt.
      mockRequest.mockImplementationOnce(async () => [successfulResponse]);

      const hostname = 'https://www.google.com';
      const client = new SmartCardClient('stg');

      const responses = await Promise.all([
        client.prefetchData(`${hostname}/1`),
        client.prefetchData(`${hostname}/2`),
        client.prefetchData(`${hostname}/3`),
      ]);

      expect(responses).toEqual([
        mocks.success,
        mocks.unauthorized,
        mocks.success,
      ]);
      expect(mockRequest).toHaveBeenCalledTimes(3);
      expect(mockRequest.mock.calls.shift()).toMatchSnapshot('initial request');
      expect(mockRequest.mock.calls.shift()).toMatchSnapshot('retry attempt 1');
      expect(mockRequest.mock.calls.shift()).toMatchSnapshot('retry attempt 2');
    });

    it('fails silently when prefetching data with exponential backoff for an errored URL which does not recover', async () => {
      mockRequest.mockImplementationOnce(async () => [
        successfulResponse,
        unauthorizedResponse,
        errorResponse,
      ]);
      // Fail on 1st, 2nd, 3rd retry attempts as well.
      mockRequest.mockImplementationOnce(async () => [errorResponse]);
      mockRequest.mockImplementationOnce(async () => [errorResponse]);
      mockRequest.mockImplementationOnce(async () => [errorResponse]);

      const hostname = 'https://www.google.com';
      const client = new SmartCardClient('stg');

      const responses = await Promise.all([
        client.prefetchData(`${hostname}/1`),
        client.prefetchData(`${hostname}/2`),
        client.prefetchData(`${hostname}/3`),
      ]);

      expect(responses).toEqual([
        mocks.success,
        mocks.unauthorized,
        // Since errors fail silently, the response in the case of an irrecoverable error
        // is set to `undefined`. This is handled accordingly upstream.
        undefined,
      ]);

      expect(mockRequest).toHaveBeenCalledTimes(4);
      expect(mockRequest.mock.calls.shift()).toMatchSnapshot('initial request');
      expect(mockRequest.mock.calls.shift()).toMatchSnapshot('retry attempt 1');
      expect(mockRequest.mock.calls.shift()).toMatchSnapshot('retry attempt 2');
      expect(mockRequest.mock.calls.shift()).toMatchSnapshot('retry attempt 3');
    });

    it('fails silently when prefetching data (stops prefetching) with exponential backoff for an errored URL which recovers with fetch flow', async () => {
      // We place one successful mock at the start to represent the calling
      // of `client.fetchData()` and it succeeding.
      mockRequest.mockImplementationOnce(async () => [successfulResponse]);
      // Then, we setup our prefetchers, with the last link failing to resolve,
      // even after retrying with backoff.
      mockRequest.mockImplementationOnce(async () => [
        successfulResponse,
        unauthorizedResponse,
        errorResponse,
      ]);
      // Fail on 1st, 2nd, 3rd retry attempts as well (none of these should be
      // called, but adding the rest for clarity, asserted below).
      mockRequest.mockImplementationOnce(async () => [errorResponse]);
      mockRequest.mockImplementationOnce(async () => [errorResponse]);
      mockRequest.mockImplementationOnce(async () => [errorResponse]);

      const hostname = 'https://www.google.com';
      const client = new SmartCardClient('stg');

      // Kickoff a proper fetch of the URL.
      const fetchResponse = await client.fetchData(`${hostname}/3`);
      expect(fetchResponse).toEqual(mocks.success);

      // Then, start prefetching - we should only prefetch once (simulating a user scrolling
      // through a page very quickly) - after which we should stop trying to prefetch with
      // exponential backoff (since we are seeing errors).
      const responses = await Promise.all([
        client.prefetchData(`${hostname}/1`),
        client.prefetchData(`${hostname}/2`),
        client.prefetchData(`${hostname}/3`),
      ]);

      expect(responses).toEqual([
        mocks.success,
        mocks.unauthorized,
        // Since errors fail silently, the response in the case of an irrecoverable error
        // is set to `undefined`. This is handled accordingly upstream.
        undefined,
      ]);

      expect(mockRequest).toHaveBeenCalledTimes(2);
      expect(mockRequest.mock.calls.shift()).toMatchSnapshot('fetch request');
      expect(mockRequest.mock.calls.shift()).toMatchSnapshot('initial request');
      expect(mockRequest.mock.calls.shift()).toMatchSnapshot('retry attempt 1');
    });
  });
});

describe('isSuccessfulResponse()', () => {
  it('should handle not valid responses', () => {
    expect(isSuccessfulResponse(undefined as any)).toBeFalsy();
    expect(isSuccessfulResponse(null as any)).toBeFalsy();
    expect(isSuccessfulResponse({} as any)).toBeFalsy();
  });

  it('should return true for valid responses', () => {
    const successResponse: SuccessResponse = {
      body: {} as any,
      status: 200,
    };
    expect(isSuccessfulResponse(successResponse)).toBeTruthy();
  });
});
