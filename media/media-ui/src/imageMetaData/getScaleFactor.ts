import { getMetaTagNumericValue } from './getMetaTagNumericValue';
import { getScaleFactorFromFile } from './getScaleFactorFromFile';
import { type ImageMetaDataTags, SupportedImageMetaTag } from './types';

// http://bonfx.com/why-is-the-web-72-dpi-and-print-300-dpi/
const DPI_WEB_BASELINE = 72;

export function getScaleFactor(file: File, tags: ImageMetaDataTags | null): number {
	const scaleFactorFromFilename = getScaleFactorFromFile(file);
	if (scaleFactorFromFilename !== null) {
		return scaleFactorFromFilename;
	} else if (tags) {
		/**
		 * Scale Factor is actually a 2D thing, but in practice X & Y are same in 99% cases.
		 * So we are only relying on X axis.
		 */
		if (typeof tags['PixelPerUnitX'] === 'number') {
			// 1 inch = 0.0254 meters
			return Math.round((tags['PixelPerUnitX'] as number) * 0.0254) / DPI_WEB_BASELINE;
		} else {
			return (
				getMetaTagNumericValue(tags, SupportedImageMetaTag.XResolution, DPI_WEB_BASELINE) /
				DPI_WEB_BASELINE
			);
		}
	} else {
		return 1;
	}
}
