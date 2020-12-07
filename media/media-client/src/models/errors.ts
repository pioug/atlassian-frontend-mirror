/**
 * Interface for media client errors
 */
export interface MediaClientErrorInterface<Attributes> extends Error {
  readonly attributes: Attributes;
}

/**
 * Base class for media client errors
 */
export abstract class BaseMediaClientError<Attributes>
  extends Error
  implements MediaClientErrorInterface<Attributes> {
  constructor(readonly message: string) {
    super(message);

    // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
    Object.setPrototypeOf(this, new.target.prototype);

    // https://v8.dev/docs/stack-trace-api
    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, new.target);
    }
  }

  abstract get attributes(): Attributes;
}

/**
 * Example subclasses of BaseMediaClientError
 */
export enum FileFetcherErrorReason {
  invalidFileId = 'invalidFileId',
}

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

export enum MediaStoreErrorReason {
  failedAuthProvider = 'failedAuthProvider',
}

export type MediaStoreErrorAttributes = {
  readonly reason: MediaStoreErrorReason;
  readonly innerError?: Error;
};

export class MediaStoreError extends BaseMediaClientError<
  MediaStoreErrorAttributes
> {
  constructor(
    readonly reason: MediaStoreErrorReason,
    readonly innerError?: Error,
  ) {
    super(reason);
  }

  get attributes() {
    const { reason, innerError } = this;
    return {
      reason,
      innerError,
    };
  }
}

export function isMediaStoreError(err: Error): err is MediaStoreError {
  return err instanceof MediaStoreError;
}
