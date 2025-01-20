import { BaseMediaClientError } from '../../models/errors';
import { type MediaTraceContext } from '@atlaskit/media-common';

export type FileFetcherErrorReason =
	| 'invalidFileId'
	| 'emptyItems'
	| 'zeroVersionFile'
	| 'emptyFileName';

export type FileFetcherErrorAttributes = {
	readonly reason: FileFetcherErrorReason;
	readonly id: string;
	readonly metadata?: {
		readonly collectionName?: string;
		readonly occurrenceKey?: string;
		readonly traceContext?: MediaTraceContext;
	};
};

export type FileFetcherErrorMetadata = {
	readonly id: string;
	readonly collectionName?: string;
	readonly occurrenceKey?: string;
	readonly traceContext?: MediaTraceContext;
};

export class FileFetcherError extends BaseMediaClientError<
	FileFetcherErrorReason,
	FileFetcherErrorMetadata,
	undefined,
	// TODO: Deprecate attributes getter https://product-fabric.atlassian.net/browse/CXP-4665
	FileFetcherErrorAttributes
> {
	// Legacy Attribute. Should be removed
	public readonly id: string;

	constructor(reason: FileFetcherErrorReason, metadata: FileFetcherErrorMetadata) {
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
			...(traceContext && { metadata: { traceContext } }),
		};
	}
}

export function isFileFetcherError(err: Error): err is FileFetcherError {
	return err instanceof FileFetcherError;
}
