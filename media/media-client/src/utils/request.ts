import { parse, stringify } from 'query-string';

import { Auth, isClientBasedAuth } from '@atlaskit/media-core';
import { mapAuthToQueryParameters } from '../models/auth-query-parameters';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type RequestParams = { [key: string]: any };

export type RequestHeaders = { [key: string]: string };

export type RequestOptions = {
  readonly method?: RequestMethod;
  readonly auth?: Auth;
  readonly params?: RequestParams;
  readonly headers?: RequestHeaders;
  readonly body?: any;
};

class HttpError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

const processFetchResponse = async (response: Response) => {
  if (response.ok || response.redirected) {
    return response;
  } else {
    const text = await response.text();
    throw new HttpError(
      `Got error code ${response.status}: ${text}`,
      response.status,
    );
  }
};

export function request(
  url: string,
  options: RequestOptions & { retryOptions?: Partial<RetryOptions> } = {},
  controller?: AbortController,
): Promise<Response> {
  const {
    method = 'GET',
    auth,
    params,
    headers,
    body,
    retryOptions = {},
  } = options;

  const doFetch = () =>
    fetch(createUrl(url, { params }), {
      method,
      body,
      headers: withAuth(auth)(headers),
      signal: controller && controller.signal,
    }).then(processFetchResponse);

  return promiseRetry(doFetch, retryOptions);
}

export function mapResponseToJson(response: Response): Promise<any> {
  return response.json();
}

export function mapResponseToBlob(response: Response): Promise<Blob> {
  return response.blob();
}

export function mapResponseToVoid(): Promise<void> {
  return Promise.resolve();
}

export type CreateUrlOptions = {
  readonly params?: RequestParams;
  readonly auth?: Auth;
};

export function createUrl(
  url: string,
  { params, auth }: CreateUrlOptions,
): string {
  const { baseUrl, queryParams } = extract(url);
  const authParams = auth && mapAuthToQueryParameters(auth);
  const queryString = stringify({
    ...queryParams,
    ...params,
    ...authParams,
  });
  const shouldAppendQueryString = queryString.length > 0;

  return `${baseUrl}${shouldAppendQueryString ? `?${queryString}` : ''}`;
}

function withAuth(auth?: Auth) {
  return (headers?: RequestHeaders): RequestHeaders | undefined => {
    if (auth) {
      return {
        ...(headers || {}),
        ...mapAuthToRequestHeaders(auth),
      };
    } else {
      return headers;
    }
  };
}

function extract(url: string): { baseUrl: string; queryParams?: any } {
  const index = url.indexOf('?');

  if (index > 0) {
    return {
      baseUrl: url.substring(0, index),
      queryParams: parse(url.substring(index + 1, url.length)),
    };
  } else {
    return {
      baseUrl: url,
    };
  }
}

function mapAuthToRequestHeaders(auth: Auth): RequestHeaders {
  if (isClientBasedAuth(auth)) {
    return {
      'X-Client-Id': auth.clientId,
      Authorization: `Bearer ${auth.token}`,
    };
  } else {
    return {
      'X-Issuer': auth.asapIssuer,
      Authorization: `Bearer ${auth.token}`,
    };
  }
}

export interface RetryOptions {
  attempts: number;
  startTimeoutInMs: number;
  factor: number;
}

const DEFAULT_OPTIONS: RetryOptions = {
  attempts: 5, // Current test delay is 60s, so retries should finish before if a promise takes < 1s
  startTimeoutInMs: 1000, // 1 second is generally a good timeout to start
  factor: 2, // Good for polling, which is out main use case
};
const wait = (timeoutInMs: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, timeoutInMs);
  });

// fetch throws TypeError for network errors
const isNotFetchNetworkError = (e: Error): boolean => !(e instanceof TypeError);

export const isAbortedRequestError = (e: Error): boolean =>
  e.message === 'request_cancelled' || e.name === 'AbortError';

async function promiseRetry<T>(
  functionToRetry: () => Promise<T>,
  overwriteOptions: Partial<RetryOptions> = {},
): Promise<T> {
  const options = {
    ...DEFAULT_OPTIONS,
    ...overwriteOptions,
  } as RetryOptions;

  let timeoutInMs = options.startTimeoutInMs;
  const waitAndBumpTimeout = async () => {
    await wait(timeoutInMs);
    timeoutInMs *= options.factor;
  };

  for (let i = 1; i <= options.attempts; i++) {
    try {
      return await functionToRetry();
    } catch (err) {
      // don't retry if request was aborted by user
      if (isAbortedRequestError(err)) {
        return Promise.reject(err);
      }

      const isLastAttempt = i === options.attempts;
      if (
        (isNotFetchNetworkError(err) && (err as HttpError).statusCode < 500) ||
        isLastAttempt
      ) {
        return Promise.reject(
          new Error(
            `The call did not succeed after ${i} attempts. Last error is\n---\n${err.stack}\n---`,
          ),
        );
      } else {
        await waitAndBumpTimeout();
      }
    }
  }
  return Promise.reject(new Error('Exhaused all attempts'));
}
