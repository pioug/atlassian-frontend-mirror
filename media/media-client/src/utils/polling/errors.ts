import { BaseMediaClientError } from '../../models/errors';
import {
	type PollingErrorReason,
	type PollingErrorAttributes,
	type PollingErrorMetadata,
} from './types';

export class PollingError extends BaseMediaClientError<
	PollingErrorReason,
	PollingErrorMetadata,
	undefined,
	PollingErrorAttributes
> {
	constructor(reason: PollingErrorReason, metadata: PollingErrorMetadata) {
		super(reason, metadata, undefined);
	}

	// TODO: Deprecate this getter https://product-fabric.atlassian.net/browse/CXP-4665
	/** Will be deprecated. Use the properties `reason` and `metadata` instead */
	get attributes() {
		const {
			reason,
			metadata: { attempts },
		} = this;
		return { reason, attempts };
	}
}

export function isPollingError(err?: Error): err is PollingError {
	return err instanceof PollingError;
}
