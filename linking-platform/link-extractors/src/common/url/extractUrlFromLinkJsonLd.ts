import { type JsonLd } from '@atlaskit/json-ld-types';

/**
 * Extracts the URL from a JSON-LD Link object or array of link objects.
 *
 * If the link is a string, it is assumed to be a URL and is returned as is.
 * If the link is an array, returns the URL in the first link object.
 * Otherwise the href property is returned.
 *
 * @param link - The JSON-LD link object or array of link objects.
 * @returns URL string if one is found, otherwise undefined.
 */
export const extractUrlFromLinkJsonLd = (
	link: JsonLd.Primitives.Link | JsonLd.Primitives.Link[],
): string | undefined => {
	if (typeof link === 'string') {
		return link;
	} else if (Array.isArray(link)) {
		if (link.length > 0) {
			return extractUrlFromLinkJsonLd(link[0]);
		}
	} else {
		return link.href;
	}
};
