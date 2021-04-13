import { FetchMock } from 'jest-fetch-mock';
import { nextTick } from '@atlaskit/media-test-helpers';

import { request } from '../../request';
import { isRequestError, RequestError } from '../../request/errors';
import { fetchRetry } from '../../request/helpers';
import { RequestMetadata } from '../../request/types';

interface ExtendedGlobal extends NodeJS.Global {
  fetch: FetchMock;
}

const extendedGlobal: ExtendedGlobal = global;

describe('request', () => {
  describe('fetchRetry', () => {
    const emptyMetadata: RequestMetadata = {};

    it('should run functionToRetry at least once', async () => {
      const functionToRetry = jest.fn();
      await fetchRetry(functionToRetry, emptyMetadata, { maxAttempts: 1 });
      expect(functionToRetry).toHaveBeenCalledTimes(1);
    });

    it('should exhaust functionToRetry if fetch error using startTimeoutInMs * factor as delay', async () => {
      jest.useFakeTimers();

      const fetchError = new TypeError('failed to fetch');
      const functionToRetry = jest.fn().mockImplementation(() => {
        throw fetchError;
      });

      const requestMetadata: RequestMetadata = {
        method: 'GET',
        endpoint: '/uri',
      };

      try {
        const p = fetchRetry(functionToRetry, requestMetadata, {
          startTimeoutInMs: 1,
          maxAttempts: 3,
          factor: 2,
        });

        jest.advanceTimersByTime(1);
        await nextTick();
        await nextTick();
        jest.advanceTimersByTime(2);
        await nextTick();
        await nextTick();
        jest.advanceTimersByTime(4);
        await nextTick();
        await nextTick();

        await p;
      } catch (err) {
        if (!isRequestError(err)) {
          return expect(isRequestError(err)).toBeTruthy();
        }
        expect(functionToRetry).toHaveBeenCalledTimes(3);
        expect(err.attributes).toMatchObject({
          reason: 'serverUnexpectedError',
          attempts: 3,
          clientExhaustedRetries: true,
          method: 'GET',
          endpoint: '/uri',
          innerError: fetchError,
        });
      }

      expect.assertions(2);

      jest.useRealTimers();
    });

    it('should exhaust functionToRetry if request error using startTimeoutInMs * factor as delay', async () => {
      jest.useFakeTimers();

      const requestMetadata: RequestMetadata = {
        method: 'GET',
        endpoint: '/uri',
      };

      const fetchError = new TypeError('failed to fetch');
      const requestError = new RequestError(
        'serverBadGateway',
        {
          ...requestMetadata,
          statusCode: 502,
        },
        fetchError,
      );
      const functionToRetry = jest.fn().mockImplementation(() => {
        throw requestError;
      });

      try {
        const p = fetchRetry(functionToRetry, requestMetadata, {
          startTimeoutInMs: 1,
          maxAttempts: 3,
          factor: 2,
        });

        jest.advanceTimersByTime(1);
        await nextTick();
        await nextTick();
        jest.advanceTimersByTime(2);
        await nextTick();
        await nextTick();
        jest.advanceTimersByTime(4);
        await nextTick();
        await nextTick();

        await p;
      } catch (err) {
        if (!isRequestError(err)) {
          return expect(isRequestError(err)).toBeTruthy();
        }
        expect(functionToRetry).toHaveBeenCalledTimes(3);
        expect(err.attributes).toMatchObject({
          reason: 'serverBadGateway',
          attempts: 3,
          clientExhaustedRetries: true,
          method: 'GET',
          endpoint: '/uri',
          statusCode: 502,
          innerError: fetchError,
        });
      }

      expect.assertions(2);

      jest.useRealTimers();
    });

    it('should not retry functionToRetry if fetch aborted', async () => {
      const functionToRetry = jest.fn().mockImplementation(() => {
        const abortError1 = new Error('request_cancelled');
        throw abortError1;
      });

      try {
        await fetchRetry(functionToRetry, emptyMetadata, { maxAttempts: 3 });
      } catch (err) {
        if (!isRequestError(err)) {
          return expect(isRequestError(err)).toBeTruthy();
        }
        expect(functionToRetry).toHaveBeenCalledTimes(1);
        expect(err.attributes).toMatchObject({
          reason: 'clientAbortedRequest',
        });
      }

      expect.assertions(2);

      functionToRetry.mockImplementation(() => {
        const abortError2 = new Error('');
        abortError2.name = 'AbortError';
        throw abortError2;
      });

      try {
        await fetchRetry(functionToRetry, emptyMetadata, { maxAttempts: 3 });
      } catch (err) {
        if (!isRequestError(err)) {
          return expect(isRequestError(err)).toBeTruthy();
        }
        expect(functionToRetry).toHaveBeenCalledTimes(2);
        expect(err.attributes).toMatchObject({
          reason: 'clientAbortedRequest',
        });
      }

      expect.assertions(4);
    });

    it('should not retry functionToRetry if client-side error', async () => {
      const functionToRetry = jest.fn().mockImplementation(() => {
        const clientSideError = new RequestError('clientTimeoutRequest');
        throw clientSideError;
      });

      try {
        await fetchRetry(functionToRetry, emptyMetadata, { maxAttempts: 3 });
      } catch (err) {
        if (!isRequestError(err)) {
          return expect(isRequestError(err)).toBeTruthy();
        }
        expect(functionToRetry).toHaveBeenCalledTimes(1);
        expect(err.attributes).toMatchObject({
          reason: 'clientTimeoutRequest',
        });
      }

      expect.assertions(2);
    });

    it('should not retry functionToRetry if backend error < 500', async () => {
      const requestMetadata: RequestMetadata = {
        method: 'GET',
        endpoint: '/uri',
      };

      const functionToRetry = jest.fn().mockImplementation(() => {
        const serverError = new RequestError('serverRateLimited', {
          ...requestMetadata,
          statusCode: 429,
        });
        throw serverError;
      });

      try {
        await fetchRetry(functionToRetry, requestMetadata, { maxAttempts: 3 });
      } catch (err) {
        if (!isRequestError(err)) {
          return expect(isRequestError(err)).toBeTruthy();
        }
        expect(functionToRetry).toHaveBeenCalledTimes(1);
        expect(err.attributes).toMatchObject({
          reason: 'serverRateLimited',
          method: 'GET',
          endpoint: '/uri',
          statusCode: 429,
        });
      }

      expect.assertions(2);
    });
  });

  const url = 'http://some-url/';
  const clientId = 'some-client-id';
  const asapIssuer = 'some-asap-issuer';
  const token = 'some-token';
  const baseUrl = 'some-base-url';

  describe('2xx codes handling', () => {
    afterEach(() => {
      extendedGlobal.fetch.resetMocks();
    });

    it('should call fetch with GET method given url only', async () => {
      await request(url);

      expect(extendedGlobal.fetch).toHaveBeenCalledWith(url, { method: 'GET' });
    });

    it('should call fetch with auth header given GET request and client based auth', async () => {
      await request(url, {
        method: 'GET',
        auth: { clientId, token, baseUrl },
      });

      expect(extendedGlobal.fetch).toHaveBeenCalledWith(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer some-token',
          'X-Client-Id': 'some-client-id',
        },
      });
    });

    it('should call fetch with auth header given GET request and asap based auth', async () => {
      await request(url, {
        method: 'GET',
        auth: { asapIssuer, token, baseUrl },
      });

      expect(extendedGlobal.fetch).toHaveBeenCalledWith(url, {
        method: 'GET',
        headers: {
          'X-Issuer': asapIssuer,
          Authorization: `Bearer ${token}`,
        },
      });
    });

    it('should call fetch with auth headers given POST request and client based auth', async () => {
      await request(url, {
        method: 'POST',
        auth: { clientId, token, baseUrl },
      });

      expect(extendedGlobal.fetch).toHaveBeenCalledWith(url, {
        method: 'POST',
        headers: {
          'X-Client-Id': clientId,
          Authorization: `Bearer ${token}`,
        },
      });
    });

    it('should call fetch with auth headers given GET request and asap based auth', async () => {
      await request(url, {
        method: 'POST',
        auth: { asapIssuer, token, baseUrl },
      });

      expect(extendedGlobal.fetch).toHaveBeenCalledWith(url, {
        method: 'POST',
        headers: {
          'X-Issuer': asapIssuer,
          Authorization: `Bearer ${token}`,
        },
      });
    });
  });

  describe('errors and retries handling', () => {
    afterEach(() => {
      extendedGlobal.fetch.resetMocks();
    });

    it('should not fail or retry if response is 3XX', async () => {
      extendedGlobal.fetch.mockResponses(
        [
          'Found',
          {
            status: 302,
            statusText: 'Found',
            headers: { Location: 'http://other-url' },
          },
        ],
        'Ok',
      );

      const response = await request(url);

      expect(response.status).toBe(302);
      expect(await response.text()).toEqual('Found');
      expect(response.headers.get('Location')).toEqual('http://other-url');
      expect(extendedGlobal.fetch.mock.calls.length).toEqual(1); // meaning it didn't retry because it shouldn't retry on 3xx
    });

    it('should fail but not retry if response is 4XX', async () => {
      extendedGlobal.fetch.once('Access forbidden', {
        status: 403,
        statusText: 'Forbidden',
      });

      let error;
      try {
        await request(url, {
          method: 'GET',
          endpoint: '/uri',
        });
      } catch (e) {
        error = e;
      }

      if (!isRequestError(error)) {
        return expect(isRequestError(error)).toBeTruthy();
      }

      expect(error.attributes).toMatchObject({
        reason: 'serverForbidden',
        method: 'GET',
        endpoint: '/uri',
        statusCode: 403,
      });

      expect(extendedGlobal.fetch.mock.calls.length).toEqual(1); // meaning it didn't retry because it shouldn't retry on 4xx
    });

    it('should retry on >= http 500', async () => {
      extendedGlobal.fetch.mockResponses(
        [
          'Internal Server Error',
          {
            status: 500,
            statusText: 'Internal Server Error',
          },
        ],
        [
          'Internal Server Error',
          {
            status: 500,
            statusText: 'Internal Server Error',
          },
        ],
        'Ok',
      );

      const response = await request(url, {
        clientOptions: {
          retryOptions: { startTimeoutInMs: 1, factor: 1 },
        },
      });

      expect(response.status).toEqual(200);
      expect(extendedGlobal.fetch.mock.calls.length).toEqual(3); // should have retried twice and succeeded
    });

    it('should retry on >= http 500 and fail on 400', async () => {
      extendedGlobal.fetch.mockResponses(
        [
          'Internal Server Error',
          {
            status: 500,
            statusText: 'Internal Server Error',
          },
        ],
        [
          'Internal Server Error',
          {
            status: 500,
            statusText: 'Internal Server Error',
          },
        ],
        [
          'Bad Request',
          {
            status: 400,
            statusText: 'Bad Request',
          },
        ],
      );

      let error;
      try {
        await request(url, {
          method: 'GET',
          endpoint: '/uri',
          clientOptions: {
            retryOptions: { startTimeoutInMs: 1, factor: 1 },
          },
        });
      } catch (e) {
        error = e;
      }

      if (!isRequestError(error)) {
        return expect(isRequestError(error)).toBeTruthy();
      }

      expect(error.attributes).toMatchObject({
        reason: 'serverBadRequest',
        method: 'GET',
        endpoint: '/uri',
        statusCode: 400,
      });

      expect(extendedGlobal.fetch.mock.calls.length).toEqual(3); // should have retried twice and hit non-retryable error
    });

    it('should retry on >= http 500 and fail after a number of attempts if unsuccessful', async () => {
      extendedGlobal.fetch.mockResponse('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });

      let error;
      try {
        await request(url, {
          method: 'GET',
          endpoint: '/uri',
          clientOptions: {
            retryOptions: { startTimeoutInMs: 1, maxAttempts: 3, factor: 1 },
          },
        });
      } catch (e) {
        error = e;
      }

      if (!isRequestError(error)) {
        return expect(isRequestError(error)).toBeTruthy();
      }

      expect(error.attributes).toMatchObject({
        reason: 'serverInternalError',
        attempts: 3,
        clientExhaustedRetries: true,
        method: 'GET',
        endpoint: '/uri',
        statusCode: 500,
      });

      expect(extendedGlobal.fetch.mock.calls.length).toEqual(3); // shoud have exhausted retries and failed
    });

    it('should not retry if request is aborted (using DOMException)', async () => {
      extendedGlobal.fetch.mockRejectOnce(
        new DOMException('The user aborted a request.', 'AbortError'),
      );

      let error;
      try {
        await request(url, {
          clientOptions: {
            retryOptions: { startTimeoutInMs: 1, factor: 1 },
          },
        });
      } catch (e) {
        error = e;
      }

      if (!isRequestError(error)) {
        return expect(isRequestError(error)).toBeTruthy();
      }

      expect(error.attributes.reason).toEqual('clientAbortedRequest');
      expect(extendedGlobal.fetch.mock.calls.length).toEqual(1); // should not have retried on aborted requests
    });

    it('should not retry if request is aborted (using Error)', async () => {
      extendedGlobal.fetch.mockRejectOnce(new Error('request_cancelled'));

      let error;
      try {
        await request(url, {
          clientOptions: {
            retryOptions: { startTimeoutInMs: 1, factor: 1 },
          },
        });
      } catch (e) {
        error = e;
      }

      if (!isRequestError(error)) {
        return expect(isRequestError(error)).toBeTruthy();
      }

      expect(error.attributes.reason).toEqual('clientAbortedRequest');
      expect(extendedGlobal.fetch.mock.calls.length).toEqual(1); // should not have retried on aborted requests
    });
  });
});
