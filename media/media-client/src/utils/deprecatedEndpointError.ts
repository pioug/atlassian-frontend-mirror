import { BaseMediaClientError } from '../models/errors';

const reason = 'deprecatedEndpoint' as const;

export type DeprecatedErrorAttributes = {
  readonly reason: typeof reason;
  readonly endpointName: string;
};
export class DeprecatedError extends BaseMediaClientError<DeprecatedErrorAttributes> {
  constructor(readonly endpointName: string) {
    super(reason);
  }

  get attributes() {
    const { endpointName } = this;
    return { reason, endpointName };
  }
}

export function isDeprecatedError(err: Error): err is DeprecatedError {
  return err instanceof DeprecatedError;
}
