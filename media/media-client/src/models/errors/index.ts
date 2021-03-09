import { MediaClientError, MediaClientErrorAttributes } from './types';

export type {
  MediaClientError,
  MediaClientErrorReason,
  MediaClientErrorAttributes,
} from './types';
export { isMediaClientError, getMediaClientErrorReason } from './helpers';

/**
 * Base class for media errors
 */
export abstract class BaseMediaClientError<
    Attributes extends MediaClientErrorAttributes
  >
  extends Error
  implements MediaClientError<Attributes> {
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
