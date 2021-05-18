import { BaseMediaClientError } from '../../models/errors';

export type FileFetcherErrorReason =
  | 'invalidFileId'
  | 'emptyItems'
  | 'zeroVersionFile';

export type FileFetcherErrorAttributes = {
  readonly reason: FileFetcherErrorReason;
  readonly id: string;
  readonly metadata?: {
    readonly collectionName?: string;
    readonly occurrenceKey?: string;
  };
};
export class FileFetcherError extends BaseMediaClientError<
  FileFetcherErrorAttributes
> {
  constructor(
    readonly reason: FileFetcherErrorReason,
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

export function isFileFetcherError(err: Error): err is FileFetcherError {
  return err instanceof FileFetcherError;
}
