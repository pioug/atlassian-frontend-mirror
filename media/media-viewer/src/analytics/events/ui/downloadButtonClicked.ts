import type { FileStatus } from '@atlaskit/media-client/file-state';
import type { WithFileAttributes } from '@atlaskit/media-common/analytics/types';
import type { FileState } from '@atlaskit/media-state/file-state';

import { getFileAttributes } from '../../getFileAttributes';
import { type ButtonClickEventPayload } from './_clickedButton';

export type DownloadButtonClickedAttributes = WithFileAttributes & {
	fileProcessingStatus: FileStatus;
};

export type DownloadButtonClickedEventPayload =
	ButtonClickEventPayload<DownloadButtonClickedAttributes>;

export const createDownloadButtonClickedEvent = (
	fileState: FileState,
): DownloadButtonClickedEventPayload => {
	const { fileId, fileMediatype, fileMimetype, fileSize } = getFileAttributes(fileState);
	return {
		eventType: 'ui',
		action: 'clicked',
		actionSubject: 'button',
		actionSubjectId: 'downloadButton',
		attributes: {
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
