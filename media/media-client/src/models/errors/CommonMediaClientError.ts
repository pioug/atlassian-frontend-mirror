import { BaseMediaClientError } from './BaseMediaClientError';
import type {
	MediaClientErrorAttributes,
	MediaClientErrorReason,
	MediaClientErrorMetadata,
} from './types';

// The only reason why this class exists is because BaseMediaClientError is abstract class, so it can't be used to deserialize ErrorFileState. We can refactor and simplify this later.
/** Generic Media Client Erorr. All errors extending BaseMediaClientError match CommonMediaClientError attributes. Used to deserialize ErrorFileState */
export class CommonMediaClientError extends BaseMediaClientError<
	MediaClientErrorReason,
	MediaClientErrorMetadata | undefined,
	Error | undefined,
	MediaClientErrorAttributes
> {
	constructor(
		reason: MediaClientErrorReason,
		metadata?: MediaClientErrorMetadata,
		innerError?: Error,
	) {
		super(reason, metadata, innerError);
	}

	get attributes(): MediaClientErrorAttributes {
		return { reason: this.reason };
	}
}
