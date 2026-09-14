import type { RemotePreviewPrimaryReason } from './errors';
import { MediaCardError } from './MediaCardError';

export class RemotePreviewError extends MediaCardError {
	constructor(
		readonly primaryReason: RemotePreviewPrimaryReason,
		readonly secondaryError?: Error | undefined,
	) {
		super(primaryReason, secondaryError);
	}
}
