import { Auth } from '@atlaskit/media-core';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type RequestParams = { [key: string]: any };

export type RequestHeaders = { [key: string]: string };

export type RetryOptions = {
  readonly startTimeoutInMs: number;
  readonly maxAttempts: number;
  readonly factor: number;
};

export type ClientOptions = {
  readonly retryOptions?: Partial<RetryOptions>;
  readonly clientTimeout?: number;
};

export type RequestMetadata = {
  readonly method?: RequestMethod;
  readonly endpoint?: string;
};

export type RequestOptions = RequestMetadata & {
  readonly auth?: Auth;
  readonly params?: RequestParams;
  readonly headers?: RequestHeaders;
  readonly body?: any;
  readonly clientOptions?: ClientOptions;
};

export type CreateUrlOptions = {
  readonly params?: RequestParams;
  readonly auth?: Auth;
};

export type RequestErrorReason =
  | 'clientOffline' // TODO: implement BMPT-964 behind feature flag
  | 'clientAbortedRequest'
  | 'clientTimeoutRequest' // TODO: implement BMPT-918 behind feature flag
  | 'serverInvalidBody'
  | 'serverBadRequest'
  | 'serverUnauthorized'
  | 'serverForbidden'
  | 'serverNotFound'
  | 'serverRateLimited'
  | 'serverInternalError'
  | 'serverBadGateway'
  | 'serverUnexpectedError';

export type RequestErrorMetadata = RequestMetadata & {
  readonly attempts?: number;
  readonly clientExhaustedRetries?: boolean;
  readonly statusCode?: number;
};

export type RequestErrorAttributes = RequestErrorMetadata & {
  readonly reason: RequestErrorReason;
};
