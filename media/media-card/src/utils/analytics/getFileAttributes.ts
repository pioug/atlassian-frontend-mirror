import { type FileDetails, type FileStatus } from '@atlaskit/media-client';
import { type FileAttributes } from '@atlaskit/media-common/analytics';

export const getFileAttributes = (
	metadata: FileDetails,
	fileStatus?: FileStatus,
): FileAttributes => ({
	fileMediatype: metadata.mediaType,
	fileMimetype: metadata.mimeType,
	fileId: metadata.id,
	fileSize: metadata.size,
	fileStatus,
});
