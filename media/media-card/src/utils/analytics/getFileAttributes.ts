import type { FileStatus } from '@atlaskit/media-client/file-state';
import type { FileDetails } from '@atlaskit/media-client/item';
import type { FileAttributes } from '@atlaskit/media-common/analytics/types';

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
