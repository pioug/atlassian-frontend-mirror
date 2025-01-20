import { BaseMediaClientError } from '../models/errors';

export type UploaderErrorReason = 'fileSizeExceedsLimit';

export type UploaderErrorAttributes = {
	readonly reason: UploaderErrorReason;
	readonly id: string;
	readonly metadata?: {
		readonly collectionName?: string;
		readonly occurrenceKey?: string;
	};
};

export type UploaderErrorMetadata = {
	readonly id: string;
	readonly collectionName?: string;
	readonly occurrenceKey?: string;
};

export class UploaderError extends BaseMediaClientError<
	UploaderErrorReason,
	UploaderErrorMetadata,
	undefined,
	UploaderErrorAttributes
> {
	// Legacy Attribute. Should be removed
	public readonly id: string;

	constructor(reason: UploaderErrorReason, metadata: UploaderErrorMetadata) {
		super(reason, metadata, undefined);
		this.id = metadata.id;
	}

	// TODO: Deprecate this getter https://product-fabric.atlassian.net/browse/CXP-4665
	/** Will be deprecated. Use the properties `reason` and `metadata` instead */
	get attributes() {
		const {
			reason,
			metadata: { id, collectionName, occurrenceKey },
		} = this;
		return {
			reason,
			id,
			collectionName,
			occurrenceKey,
		};
	}
}

export function isUploaderError(err: Error): err is UploaderError {
	return err instanceof UploaderError;
}
