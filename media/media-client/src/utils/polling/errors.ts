import { BaseMediaClientError } from '../../models/errors';
import { PollingErrorReason, PollingErrorAttributes } from './types';

export class PollingError extends BaseMediaClientError<PollingErrorAttributes> {
  constructor(readonly reason: PollingErrorReason, readonly attempts: number) {
    super(reason);
  }

  get attributes() {
    const { reason, attempts } = this;
    return { reason, attempts };
  }
}

export function isPollingError(err: Error): err is PollingError {
  return err instanceof PollingError;
}
