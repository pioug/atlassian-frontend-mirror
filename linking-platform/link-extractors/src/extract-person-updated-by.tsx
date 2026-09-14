import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractPersonFromJsonLd } from './extract-person-from-json-ld';
import type { LinkPerson, LinkTypeUpdatedBy } from './types';

export const extractPersonUpdatedBy = (jsonLd: LinkTypeUpdatedBy): LinkPerson | undefined => {
	const updatedBy = jsonLd['atlassian:updatedBy'];
	if (updatedBy) {
		return extractPersonFromJsonLd(updatedBy as JsonLd.Primitives.Object | JsonLd.Primitives.Link);
	}
	return undefined;
};
