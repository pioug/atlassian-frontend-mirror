import { BaseMediaClientError } from '../models/errors';

export type UploaderErrorReason = 'fileSizeExceedsLimit';

export type UploaderErrorAttributes = {
  readonly reason: UploaderErrorReason;
  readonly id: string;
  readonly metadata?: {
    readonly collectionName?: string;
    readonly occurrenceKey?: string;
  };
};
export class UploaderError extends BaseMediaClientError<UploaderErrorAttributes> {
  constructor(
    readonly reason: UploaderErrorReason,
    readonly id: string,
    readonly metadata?: {
      readonly collectionName?: string;
      readonly occurrenceKey?: string;
    },
  ) {
    super(reason);
  }

  get attributes() {
    const {
      reason,
      id,
      metadata: { collectionName, occurrenceKey } = {},
    } = this;
    return {
      reason,
      id,
      collectionName,
      occurrenceKey,
    };
  }
}

export function isUploaderError(err: Error): err is UploaderError {
  return err instanceof UploaderError;
}
