import { isProcessedFileState } from '@atlaskit/media-client';
import { isVideoMimeTypeSupportedByBrowser } from '@atlaskit/media-common/isMimeTypeSupportedByBrowser';
import type { FileState } from '@atlaskit/media-state/file-state';

export const videoIsPlayable = (
	isBannedLocalPreview: boolean,
	fileState?: FileState,
	mimeType?: string,
): boolean => {
	const localPreviewAvailable =
		mimeType && !isBannedLocalPreview && isVideoMimeTypeSupportedByBrowser(mimeType);

	const videoProcessedByServer = fileState && isProcessedFileState(fileState);

	return !!(localPreviewAvailable || videoProcessedByServer);
};
