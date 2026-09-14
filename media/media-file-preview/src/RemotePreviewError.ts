import type { RemotePreviewPrimaryReason } from './errors';
import { MediaFilePreviewError } from './MediaFilePreviewError';

export class RemotePreviewError extends MediaFilePreviewError {
	constructor(
		readonly primaryReason: RemotePreviewPrimaryReason,
		readonly secondaryError?: Error | undefined,
	) {
		super(primaryReason, secondaryError);
	}
}
