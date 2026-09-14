import type { SsrPreviewPrimaryReason } from './errors';
import { MediaCardError } from './MediaCardError';

export class SsrPreviewError extends MediaCardError {
	constructor(
		readonly primaryReason: SsrPreviewPrimaryReason,
		readonly secondaryError?: Error | undefined,
	) {
		super(primaryReason, secondaryError);
	}
}
