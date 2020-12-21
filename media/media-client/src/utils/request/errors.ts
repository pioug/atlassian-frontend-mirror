import { BaseMediaClientError } from '../../models/errors';
import { RequestErrorReason, RequestErrorAttributes } from './types';

export class RequestError extends BaseMediaClientError<RequestErrorAttributes> {
  constructor(
    readonly reason: RequestErrorReason,
    readonly metadata?: {
      readonly attempts?: number;
      readonly statusCode?: number;
      readonly bodyAsText?: string;
      readonly innerError?: Error;
    },
  ) {
    super(reason);
  }

  get attributes() {
    const {
      reason,
      metadata: { attempts, statusCode, bodyAsText, innerError } = {},
    } = this;
    return { reason, attempts, statusCode, bodyAsText, innerError };
  }
}

export function isRequestError(err: Error): err is RequestError {
  return err instanceof RequestError;
}

export function isRateLimitedError(error: Error | undefined) {
  return (
    (!!error && isRequestError(error) && error.attributes.statusCode === 429) ||
    (!!error && !!error.message && error.message.includes('429'))
  );
}

export function getErrorName(
  error: Error | undefined,
  defaultErrorName: string,
) {
  return isRateLimitedError(error) ? 'rateLimited' : defaultErrorName;
}
