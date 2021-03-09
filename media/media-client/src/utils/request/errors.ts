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
  ) {
    super(reason);
  }

  get attributes() {
    const {
      reason,
      metadata: {
        attempts,
        clientExhaustedRetries,
        statusCode,
        bodyAsText,
        innerError,
      } = {},
    } = this;

    return {
      reason,
      attempts,
      clientExhaustedRetries,
      statusCode,
      bodyAsText,
      innerError,
    };
  }
}

export function isRequestError(err: Error): err is RequestError {
  return err instanceof RequestError;
}
