import { type JsonLd } from 'json-ld-types';

import { type LinkPerson } from './types';

import { extractPersonFromJsonLd } from './index';

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
};
