import { type ImageMetaDataTags } from './types';

export function getMetaTagNumericValue(
	tags: ImageMetaDataTags,
	key: string,
	defaultValue: number,
): number {
	try {
		const num = parseFloat(`${tags[key]}`);
		if (!isNaN(num)) {
			return num;
		}
	} catch (e) {
		//
	}
	return defaultValue;
}
