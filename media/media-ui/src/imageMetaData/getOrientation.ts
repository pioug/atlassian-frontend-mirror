import { readImageMetaTags } from './metatags';
import { type ImageMetaDataTags, ExifOrientation, SupportedImageMetaTag } from './types';

const getOrientationFromTags = (tags: ImageMetaDataTags | null) => {
	if (tags && tags[SupportedImageMetaTag.Orientation]) {
		const tagValue = tags[SupportedImageMetaTag.Orientation];
		if (tagValue) {
			const numericValue = parseInt(tagValue, 10);
			if (isNaN(numericValue)) {
				return ExifOrientation[tagValue];
			}
			return numericValue;
		}
	}
	return 1;
};

export async function getOrientation(file: File): Promise<number> {
	const tags = await readImageMetaTags(file);
	return getOrientationFromTags(tags);
}
