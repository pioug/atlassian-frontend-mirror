import { type MediaTraceContext } from '@atlaskit/media-common';
import { BaseMediaClientError } from '../../models/errors';

export type MobileUploadErrorReason = 'emptyItems' | 'zeroVersionFile';

export type MobileUploadErrorAttributes = {
	readonly reason: MobileUploadErrorReason;
	readonly id: string;
	readonly metadata?: {
		readonly collectionName?: string;
		readonly occurrenceKey?: string;
		readonly traceContext?: MediaTraceContext;
	};
};
export type MobileUploadErrorMetadata = {
	readonly id: string;
	readonly collectionName?: string;
	readonly occurrenceKey?: string;
	readonly traceContext?: MediaTraceContext;
};

export class MobileUploadError extends BaseMediaClientError<
	MobileUploadErrorReason,
	MobileUploadErrorMetadata,
	undefined,
	MobileUploadErrorAttributes
> {
	// Legacy Attribute. Should be removed
	public readonly id: string;

	constructor(reason: MobileUploadErrorReason, metadata: MobileUploadErrorMetadata) {
		super(reason, metadata, undefined);
		this.id = metadata.id;
	}

	// TODO: Deprecate this getter https://product-fabric.atlassian.net/browse/CXP-4665
	/** Will be deprecated. Use the properties `reason` and `metadata` instead */
	get attributes() {
		const {
			reason,
			metadata: { id, collectionName, occurrenceKey, traceContext },
		} = this;
		return {
			reason,
			id,
			collectionName,
			occurrenceKey,
			metadata: { traceContext },
		};
	}
}

export function isMobileUploadError(err: Error): err is MobileUploadError {
	return err instanceof MobileUploadError;
}
