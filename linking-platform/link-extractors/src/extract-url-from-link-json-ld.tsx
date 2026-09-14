import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

/*
 * ###########################################################################
 * URL extraction
 * ###########################################################################
 *
 * Helpers for normalising JSON-LD Link and Image URL shapes into strings.
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
	return undefined;
};
