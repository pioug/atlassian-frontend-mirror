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
export class FileFetcherError extends BaseMediaClientError<FileFetcherErrorAttributes> {
	constructor(
		readonly reason: FileFetcherErrorReason,
		readonly id: string,
		readonly metadata?: {
			readonly collectionName?: string;
			readonly occurrenceKey?: string;
			readonly traceContext?: MediaTraceContext;
		},
	) {
		super(reason);
	}

	get attributes() {
		const { reason, id, metadata: { collectionName, occurrenceKey, traceContext } = {} } = this;
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
