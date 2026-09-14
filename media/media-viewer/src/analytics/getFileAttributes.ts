import { type FileState } from '@atlaskit/media-client';
import { type FileAttributes } from '@atlaskit/media-common/analytics';

export function getFileAttributes(fileState?: FileState): FileAttributes {
	if (!fileState) {
		return {
			fileId: 'undefined',
		};
	}
	const { id: fileId } = fileState;
	switch (fileState.status) {
		case 'uploading':
		case 'failed-processing':
		case 'processing':
		case 'processed':
			const { mediaType: fileMediatype, mimeType: fileMimetype, size: fileSize } = fileState;
			return {
				fileId,
				fileMediatype,
				fileMimetype,
				fileSize,
			};
		case 'error':
			return {
				fileId,
			};
	}
}
