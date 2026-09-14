import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractPersonFromJsonLd } from './extract-person-from-json-ld';
import type { LinkPerson } from './types';

export const extractPersonCreatedBy = (jsonLd: JsonLd.Data.BaseData): LinkPerson[] | undefined => {
	const attributedTo = jsonLd.attributedTo;
	if (attributedTo) {
		if (Array.isArray(attributedTo)) {
			return attributedTo.map(extractPersonFromJsonLd).filter((item) => !!item) as LinkPerson[];
		} else {
			const item = extractPersonFromJsonLd(attributedTo);
			if (item) {
				return [item];
			}
		}
	}
	return undefined;
};
