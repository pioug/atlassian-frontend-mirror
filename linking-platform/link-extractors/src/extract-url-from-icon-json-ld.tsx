import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractUrlFromLinkJsonLd } from './extract-url-from-link-json-ld';

export const extractUrlFromIconJsonLd = (
	icon: JsonLd.Primitives.Link | JsonLd.Primitives.Image,
): string | undefined => {
	if (typeof icon === 'string') {
		return icon;
	} else if (icon['@type'] === 'Link') {
		return extractUrlFromLinkJsonLd(icon);
	} else {
		if (icon.url) {
			return extractUrlFromLinkJsonLd(icon.url);
		}
	}
	return undefined;
};
