import { type FileStatus, type FileState } from '@atlaskit/media-client';
import { type WithFileAttributes } from '@atlaskit/media-common';

import type { MediaViewerError } from '../../../MediaViewerError';
import type { PrimaryErrorReason } from '../../../errors';
import { getPrimaryErrorReason } from '../../../getPrimaryErrorReason';
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
