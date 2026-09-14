import { getScaleFactor } from './getScaleFactor';
import { readImageMetaData } from './readImageMetaData';
import { type ImageInfo, type FileInfo } from './types';

export async function getImageInfo(fileInfo: FileInfo): Promise<ImageInfo | null> {
	const metadata = await readImageMetaData(fileInfo);
	if (!metadata) {
		return null;
	}
	const { width, height, tags } = metadata;
	const scaleFactor = getScaleFactor(fileInfo.file, tags);
	return {
		scaleFactor,
		width,
		height,
	};
}
