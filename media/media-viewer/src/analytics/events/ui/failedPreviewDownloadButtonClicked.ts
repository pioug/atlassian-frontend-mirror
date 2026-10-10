import type { FileStatus } from '@atlaskit/media-client/file-state';
import type { WithFileAttributes } from '@atlaskit/media-common/analytics/types';
import type { FileState } from '@atlaskit/media-state/file-state';

import type { PrimaryErrorReason } from '../../../errors';
import { getPrimaryErrorReason } from '../../../getPrimaryErrorReason';
import type { MediaViewerError } from '../../../MediaViewerError';
import { getFileAttributes } from '../../getFileAttributes';
import { type ButtonClickEventPayload } from './_clickedButton';

export type FailedPreviewDownloadButtonClickedAttributes = WithFileAttributes & {
	fileProcessingStatus: FileStatus;
	failReason: PrimaryErrorReason;
};

export type FailedPreviewDownloadButtonClickedEventPayload =
	ButtonClickEventPayload<FailedPreviewDownloadButtonClickedAttributes>;

export const createFailedPreviewDownloadButtonClickedEvent = (
	fileState: FileState,
	error: MediaViewerError,
): FailedPreviewDownloadButtonClickedEventPayload => {
	const { fileId, fileMediatype, fileMimetype, fileSize } = getFileAttributes(fileState);
	return {
		eventType: 'ui',
		action: 'clicked',
		actionSubject: 'button',
		actionSubjectId: 'failedPreviewDownloadButton',
		attributes: {
			failReason: getPrimaryErrorReason(error),
			fileAttributes: {
				fileId,
				fileMediatype,
				fileMimetype,
				fileSize,
			},
			fileProcessingStatus: fileState.status,
		},
	};
};
