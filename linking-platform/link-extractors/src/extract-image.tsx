import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractUrlFromLinkJsonLd } from './extract-url-from-link-json-ld';

/*
 * ###########################################################################
 * Preview extraction
 * ###########################################################################
 *
 * Extractors for preview, embed, image, and platform support metadata.
 */
export const extractImage = (jsonLd: JsonLd.Data.BaseData): string | undefined => {
	const image = jsonLd.image;
	if (image) {
		if (typeof image === 'string') {
			return image;
		} else if (image['@type'] === 'Link') {
			return extractUrlFromLinkJsonLd(image);
		} else if (image['@type'] === 'Image') {
			if (image.url) {
				return extractUrlFromLinkJsonLd(image.url);
			}
		}
	}
	return undefined;
};
