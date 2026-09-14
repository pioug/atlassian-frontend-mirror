import type { LocalPreviewPrimaryReason } from './errors';
import { MediaFilePreviewError } from './MediaFilePreviewError';

export class LocalPreviewError extends MediaFilePreviewError {
	constructor(
		readonly primaryReason: LocalPreviewPrimaryReason,
		readonly secondaryError?: Error | undefined,
	) {
		super(primaryReason, secondaryError);
	}
}
