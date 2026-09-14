import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const extractLinkName = (link?: JsonLd.Primitives.Link): string | undefined => {
	if (link && typeof link === 'object' && link['@type'] === 'Link') {
		return link.name;
	}
};
