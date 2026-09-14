import type { SsrPreviewPrimaryReason } from './errors';
import { MediaFilePreviewError } from './MediaFilePreviewError';

export class SsrPreviewError extends MediaFilePreviewError {
	constructor(
		readonly primaryReason: SsrPreviewPrimaryReason,
		readonly secondaryError?: Error | undefined,
	) {
		super(primaryReason, secondaryError);
	}
}
