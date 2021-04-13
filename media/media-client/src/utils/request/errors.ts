import { BaseMediaClientError } from '../../models/errors';

import {
  RequestErrorReason,
  RequestErrorMetadata,
  RequestErrorAttributes,
} from './types';

export class RequestError extends BaseMediaClientError<RequestErrorAttributes> {
  constructor(
    readonly reason: RequestErrorReason,
    readonly metadata?: RequestErrorMetadata,
    readonly innerError?: Error,
  ) {
    super(reason);
  }

  get attributes() {
    const {
      reason,
      metadata: {
        method,
        endpoint,
        attempts,
        clientExhaustedRetries,
        statusCode,
      } = {},
      innerError,
    } = this;

    return {
      reason,
      method,
      endpoint,
      attempts,
      clientExhaustedRetries,
      statusCode,
      innerError,
    };
  }
}

export function isRequestError(err: Error): err is RequestError {
  return err instanceof RequestError;
}
