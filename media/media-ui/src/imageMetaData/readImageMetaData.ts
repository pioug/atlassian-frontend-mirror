import { loadImage } from '../loadImage';
import { readImageNaturalOrientationFromDOM } from '../readImageNaturalOrientationFromDOM';
import { getMetaTagNumericValue } from './getMetaTagNumericValue';
import { readImageMetaTags } from './metatags';
import { type ImageMetaData, type FileInfo } from './types';

export async function readImageMetaData(fileInfo: FileInfo): Promise<ImageMetaData | null> {
	const { file, src } = fileInfo;
	const type = file.type;
	let width = 0;
	let height = 0;
	const tags = await readImageMetaTags(file);
	// since we're reading metadata anyway, try to get dimensions from there...
	if (tags && tags.PixelXDimension) {
		width = getMetaTagNumericValue(tags, 'PixelXDimension', 0);
	}
	if (tags && tags.PixelXDimension) {
		height = getMetaTagNumericValue(tags, 'PixelYDimension', 0);
	}
	const data: ImageMetaData = {
		type,
		width,
		height,
		naturalWidth: width,
		naturalHeight: height,
		tags,
	};

	/*
	 * The PixelXDimension and PixelYDimension of image tags can mean something different than just width and height, especially when images are compressed or for other reasons.
	 * https://imagemagick.org/discourse-server/viewtopic.php?t=27037
	 * We've also received JAC tickets reporting incorrect dimensions because of this
	 * https://jira.atlassian.com/browse/CONFCLOUD-78275
	 * The best way to get accurate dimensions is by loading images into the HTML, which reflects the actual dimensions the browser will render
	 */
	try {
		const img = await loadImage(src);
		const { width, height } = readImageNaturalOrientationFromDOM(img);
		data.width = width;
		data.height = height;
		data.naturalWidth = img.naturalWidth;
		data.naturalHeight = img.naturalHeight;
	} catch (e) {
		return null;
	}

	return data;
}
