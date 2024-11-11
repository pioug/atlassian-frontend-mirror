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
export class MobileUploadError extends BaseMediaClientError<MobileUploadErrorAttributes> {
	constructor(
		readonly reason: MobileUploadErrorReason,
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
			metadata: { traceContext },
		};
	}
}

export function isMobileUploadError(err: Error): err is MobileUploadError {
	return err instanceof MobileUploadError;
}
