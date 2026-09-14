import { type FileState } from '@atlaskit/media-client';
import { type WithFileAttributes } from '@atlaskit/media-common';

import type { MediaViewerError } from '../../../MediaViewerError';
import type { PrimaryErrorReason } from '../../../errors';
import { getPrimaryErrorReason } from '../../../getPrimaryErrorReason';
import { getFileAttributes } from '../../getFileAttributes';
import { type MediaFileEventPayload } from './_mediaFile';

export type PreviewTooLargeAttributes = WithFileAttributes & {
	failReason: PrimaryErrorReason;
};

export type PreviewTooLargeEventPayload = MediaFileEventPayload<
	PreviewTooLargeAttributes,
	'previewTooLarge'
>;

export const createPreviewTooLargeEvent = (
	error: MediaViewerError,
	fileState: FileState,
): PreviewTooLargeEventPayload => {
	const { fileId, fileMediatype, fileMimetype, fileSize } = getFileAttributes(fileState);
	return {
		eventType: 'operational',
		actionSubject: 'mediaFile',
		action: 'previewTooLarge',
		attributes: {
			failReason: getPrimaryErrorReason(error),
			fileAttributes: {
				fileId,
				fileMediatype,
				fileMimetype,
				fileSize,
			},
		},
	};
};
