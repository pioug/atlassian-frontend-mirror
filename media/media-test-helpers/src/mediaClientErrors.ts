import {
  RequestError,
  RequestErrorMetadata,
  PollingError,
} from '@atlaskit/media-client';

export const createRateLimitedError = (metadata: RequestErrorMetadata = {}) =>
  new RequestError('serverRateLimited', {
    ...metadata,
    statusCode: 429,
  });

export const createPollingMaxAttemptsError = (attempts = 1) =>
  new PollingError('pollingMaxAttemptsExceeded', attempts);
