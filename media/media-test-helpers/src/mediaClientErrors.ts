import { RequestError, PollingError } from '@atlaskit/media-client';

export const createRateLimitedError = () =>
  new RequestError('serverRateLimited', {
    statusCode: 429,
  });

export const createPollingMaxFailuresError = (attempts = 1) =>
  new PollingError('pollingMaxAttemptsExceeded', attempts);

export const createPollingMaxAttemptsError = (attempts = 1) =>
  new PollingError('pollingMaxAttemptsExceeded', attempts);
