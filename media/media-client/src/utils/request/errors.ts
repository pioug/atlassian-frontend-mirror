import { BaseMediaClientError } from '../../models/errors';

import {
	type RequestErrorReason,
	type RequestErrorMetadata,
	type RequestErrorAttributes,
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
