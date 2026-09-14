import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractPersonFromJsonLd } from './extract-person-from-json-ld';
import type { LinkPerson } from './types';

export const extractPersonOwnedBy = (jsonLd: JsonLd.Data.BaseData): LinkPerson[] | undefined => {
	const ownedBy = jsonLd['atlassian:ownedBy'];
	if (ownedBy) {
		if (Array.isArray(ownedBy)) {
			return ownedBy.map(extractPersonFromJsonLd).filter((item) => !!item) as LinkPerson[];
		} else {
			const item = extractPersonFromJsonLd(ownedBy);
			if (item) {
				return [item];
			}
		}
	}
	return undefined;
};
