import { type ZipEntry } from 'unzipit';

import type { SuccessAttributes, WithFileAttributes } from '@atlaskit/media-common/analytics/types';
import type { FileState } from '@atlaskit/media-state/file-state';

import { getMimeTypeFromFilename } from '../../../utils/getMimeTypeFromFilename';
import { getFileAttributes } from '../../getFileAttributes';
import { type MediaFileEventPayload } from './_mediaFile';

export type ZipEntryLoadSucceededAttributes = SuccessAttributes &
	WithFileAttributes & {
		size: number;
		encrypted: boolean;
		compressedSize: number;
		mimeType: string;
	};

export type ZipEntryLoadSucceededEventPayload = MediaFileEventPayload<
	ZipEntryLoadSucceededAttributes,
	'zipEntryLoadSucceeded'
>;

export const createZipEntryLoadSucceededEvent = (
	fileState: FileState,
	zipEntry: ZipEntry,
): ZipEntryLoadSucceededEventPayload => {
	const { fileId, fileMediatype, fileMimetype, fileSize, fileStatus } =
		getFileAttributes(fileState);
	return {
		eventType: 'operational',
		actionSubject: 'mediaFile',
		action: 'zipEntryLoadSucceeded',
		attributes: {
			status: 'success',
			fileAttributes: {
				fileId,
				fileMediatype,
				fileMimetype,
				fileSize,
				fileStatus,
			},
			size: zipEntry.size,
			encrypted: zipEntry.encrypted,
			compressedSize: zipEntry.compressedSize,
			mimeType: getMimeTypeFromFilename(zipEntry.name),
		},
	};
};
