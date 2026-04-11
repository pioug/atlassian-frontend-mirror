import type { MediaTraceContext } from '@atlaskit/media-common';
import { BaseMediaClientError } from '../../models/errors';

import {
	type RequestErrorReason,
	type RequestErrorMetadata,
	type RequestErrorAttributes,
	type RequestMethod,
} from './types';

export class RequestError extends BaseMediaClientError<
	RequestErrorReason,
	RequestErrorMetadata | undefined,
	Error | undefined,
	RequestErrorAttributes
> {
	constructor(reason: RequestErrorReason, metadata?: RequestErrorMetadata, innerError?: Error) {
		super(reason, metadata, innerError);
	}

	// TODO: Deprecate this getter https://product-fabric.atlassian.net/browse/CXP-4665
	/** Will be deprecated. Use the properties `reason` and `metadata` instead */
	get attributes(): {
		reason: RequestErrorReason;
		method: RequestMethod | undefined;
		endpoint: string | undefined;
		mediaRegion: string | undefined;
		mediaEnv: string | undefined;
		attempts: number | undefined;
		clientExhaustedRetries: boolean | undefined;
		statusCode: number | undefined;
		metadata: {
			traceContext: MediaTraceContext | undefined;
		};
		innerError: Error | undefined;
	} {
		const {
			reason,
			metadata: {
				method,
				endpoint,
				mediaRegion,
				mediaEnv,
				attempts,
				clientExhaustedRetries,
				statusCode,
				traceContext,
			} = {},
			innerError,
		} = this;

		return {
			reason,
			method,
			endpoint,
			mediaRegion,
			mediaEnv,
			attempts,
			clientExhaustedRetries,
			statusCode,
			metadata: { traceContext },
			innerError,
		};
	}
}

export function isRequestError(err: Error): err is RequestError {
	return err instanceof RequestError;
}
