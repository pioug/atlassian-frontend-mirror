import { getType } from 'mime';

export const getMimeTypeFromFilename = (filename: string): string => {
	const extension = filename.split('.').pop();
	if (!extension) {
		return '';
	}

	const mimeType = getType(extension);
	if (!mimeType) {
		return '';
	}

	return mimeType;
};
