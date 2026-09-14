import type { LocalPreviewPrimaryReason } from './errors';
import { MediaCardError } from './MediaCardError';

export class LocalPreviewError extends MediaCardError {
	constructor(
		readonly primaryReason: LocalPreviewPrimaryReason,
		readonly secondaryError?: Error | undefined,
	) {
		super(primaryReason, secondaryError);
	}
}
