import { type FileState } from '@atlaskit/media-client';
import { type SuccessAttributes, type WithFileAttributes } from '@atlaskit/media-common/analytics';
import { type ZipEntry } from 'unzipit';
import { type MediaFileEventPayload } from './_mediaFile';
import { getMimeTypeFromFilename } from '../../../utils';
import { getFileAttributes } from '../..';

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
