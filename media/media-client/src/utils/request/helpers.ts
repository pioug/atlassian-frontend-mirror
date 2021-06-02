import { Auth, isClientBasedAuth } from '@atlaskit/media-core';
import { parse, stringify } from 'query-string';

import { mapAuthToQueryParameters } from '../../models/auth-query-parameters';
import { RequestError, isRequestError } from './errors';

import {
  CreateUrlOptions,
  RequestErrorReason,
  RequestErrorMetadata,
  RequestHeaders,
  RequestMetadata,
  RetryOptions,
} from './types';

export function clientTimeoutPromise(timeout: number) {
  return new Promise<Response>((resolve, reject) => {
    setTimeout(reject, timeout, new RequestError('clientTimeoutRequest'));
  });
}

export function waitPromise(timeout: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, timeout));
}

export function isAbortedRequestError(err: any): boolean {
  return (
    (err instanceof Error && err.message === 'request_cancelled') ||
    (!!err && err.name === 'AbortError')
  );
}

// fetch throws TypeError for network errors
export function isFetchNetworkError(err: any): err is TypeError {
  return err instanceof TypeError;
}

export function isRateLimitedError(error: Error | undefined) {
  return (
    (!!error && isRequestError(error) && error.attributes.statusCode === 429) ||
    (!!error && !!error.message && error.message.includes('429'))
  );
}

export function extract(url: string): { baseUrl: string; queryParams?: any } {
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

export function mapAuthToRequestHeaders(auth: Auth): RequestHeaders {
  if (isClientBasedAuth(auth)) {
    return {
      'X-Client-Id': auth.clientId,
      Authorization: `Bearer ${auth.token}`,
    };
  }

  return {
    'X-Issuer': auth.asapIssuer,
    Authorization: `Bearer ${auth.token}`,
  };
}

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

export function withAuth(auth?: Auth) {
  return (headers?: RequestHeaders): RequestHeaders | undefined => {
    if (auth) {
      return {
        ...(headers || {}),
        ...mapAuthToRequestHeaders(auth),
      };
    }

    return headers;
  };
}

/**
 * @deprecated Helper is deprecated and will be removed in the next major version.
 * TODO: https://product-fabric.atlassian.net/browse/BMPT-1354
 */
export async function mapResponseToJson(response: Response): Promise<any> {
  // eslint-disable-next-line no-console
  console.warn(
    'Helper is deprecated and will be remove in the next major version',
  );

  try {
    return await response.json();
  } catch (err) {
    throw new RequestError(
      'serverInvalidBody',
      {
        statusCode: response.status,
      },
      err,
    );
  }
}

/**
 * @deprecated Helper is deprecated and will be removed in the next major version.
 * TODO: https://product-fabric.atlassian.net/browse/BMPT-1354
 */
export async function mapResponseToBlob(response: Response): Promise<Blob> {
  // eslint-disable-next-line no-console
  console.warn(
    'Helper is deprecated and will be remove in the next major version',
  );

  try {
    return await response.blob();
  } catch (err) {
    throw new RequestError(
      'serverInvalidBody',
      {
        statusCode: response.status,
      },
      err,
    );
  }
}

/**
 * @deprecated Helper is deprecated and will be removed in the next major version.
 * TODO: https://product-fabric.atlassian.net/browse/BMPT-1354
 */
export function mapResponseToVoid(): Promise<void> {
  // eslint-disable-next-line no-console
  console.warn(
    'Helper is deprecated and will be remove in the next major version',
  );

  return Promise.resolve();
}

export function createMapResponseToJson(
  metadata: RequestMetadata,
): (response: Response) => Promise<any> {
  return async (response: Response) => {
    try {
      return await response.json();
    } catch (err) {
      throw new RequestError(
        'serverInvalidBody',
        {
          ...metadata,
          statusCode: response.status,
        },
        err,
      );
    }
  };
}

export function createMapResponseToBlob(
  metadata: RequestMetadata,
): (response: Response) => Promise<Blob> {
  return async (response: Response) => {
    try {
      return await response.blob();
    } catch (err) {
      throw new RequestError(
        'serverInvalidBody',
        {
          ...metadata,
          statusCode: response.status,
        },
        err,
      );
    }
  };
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  startTimeoutInMs: 1000, // 1 second is generally a good timeout to start
  maxAttempts: 5, // Current test delay is 60s, so retries should finish before if a promise takes < 1s
  factor: 2, // Good for polling, which is out main use case
};

export function cloneRequestError(
  error: RequestError,
  extraMetadata: Partial<RequestErrorMetadata>,
): RequestError {
  const { reason, metadata, innerError } = error;

  return new RequestError(
    reason,
    {
      ...metadata,
      ...extraMetadata,
    },
    innerError,
  );
}

export async function fetchRetry(
  functionToRetry: () => Promise<Response>,
  metadata: RequestMetadata,
  overwriteOptions: Partial<RetryOptions> = {},
): Promise<Response> {
  const options = {
    ...DEFAULT_RETRY_OPTIONS,
    ...overwriteOptions,
  };
  const { startTimeoutInMs, maxAttempts, factor } = options;

  let attempts = 0;
  let timeoutInMs = startTimeoutInMs;
  let lastError: any;

  const waitAndBumpTimeout = async () => {
    await waitPromise(timeoutInMs);
    timeoutInMs *= factor;
    attempts += 1;
  };

  while (attempts < maxAttempts) {
    try {
      return await functionToRetry();
    } catch (err) {
      lastError = err;

      // don't retry if request was aborted by user
      if (isAbortedRequestError(err)) {
        throw new RequestError('clientAbortedRequest', metadata, err);
      }

      if (
        (!isFetchNetworkError(err) && !isRequestError(err)) ||
        (isRequestError(err) &&
          (!err.metadata ||
            !err.metadata.statusCode ||
            err.metadata.statusCode < 500))
      ) {
        throw err;
      }

      await waitAndBumpTimeout();
    }
  }

  if (isRequestError(lastError)) {
    throw cloneRequestError(lastError, {
      attempts,
      clientExhaustedRetries: true,
    });
  }

  throw new RequestError(
    'serverUnexpectedError',
    {
      ...metadata,
      attempts,
      clientExhaustedRetries: true,
    },
    lastError,
  );
}

export function createRequestErrorReason(
  statusCode: number,
): RequestErrorReason {
  switch (statusCode) {
    case 400:
      return 'serverBadRequest';
    case 401:
      return 'serverUnauthorized';
    case 403:
      return 'serverForbidden';
    case 404:
      return 'serverNotFound';
    case 429:
      return 'serverRateLimited';
    case 500:
      return 'serverInternalError';
    case 502:
      return 'serverBadGateway';
    default:
      return 'serverUnexpectedError';
  }
}

export function createRequestErrorFromResponse(
  metadata: RequestErrorMetadata,
  response: Response,
): RequestError {
  const { status: statusCode } = response;
  const reason = createRequestErrorReason(statusCode);
  return new RequestError(reason, {
    ...metadata,
    statusCode,
  });
}

export function createProcessFetchResponse(
  metadata: RequestMetadata,
): (response: Response) => Response {
  return (response: Response) => {
    if (response.ok || response.status < 400) {
      return response;
    }

    const requestError = createRequestErrorFromResponse(metadata, response);
    throw requestError;
  };
}
