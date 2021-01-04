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

export type RequestOptions = {
  readonly method?: RequestMethod;
  readonly auth?: Auth;
  readonly params?: RequestParams;
  readonly headers?: RequestHeaders;
  readonly body?: any;
  readonly clientOptions?: ClientOptions;
};

export type RequestErrorReason =
  | 'clientOffline' // TODO: implement BMPT-964 behind feature flag
  | 'clientAbortedRequest'
  | 'clientTimeoutRequest' // TODO: implement BMPT-918 behind feature flag
  | 'clientExhaustedRetries'
  | 'serverError'
  | 'serverInvalidBody';

export type RequestErrorAttributes = {
  readonly reason: RequestErrorReason;
  readonly attempts?: number;
  readonly statusCode?: number;
  readonly bodyAsText?: string;
  readonly innerError?: Error;
};

export type CreateUrlOptions = {
  readonly params?: RequestParams;
  readonly auth?: Auth;
};
