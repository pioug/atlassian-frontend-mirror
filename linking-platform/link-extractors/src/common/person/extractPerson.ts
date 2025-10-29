import { type JsonLd } from '@atlaskit/json-ld-types';

import { extractUrlFromIconJsonLd } from '../url';

import { type LinkPerson } from './types';

export const extractPersonFromJsonLd = (
	person: JsonLd.Primitives.Object | JsonLd.Primitives.Link,
): LinkPerson | undefined => {
	if (typeof person === 'string') {
		throw Error('Link.person needs to be an object.');
	} else if (person['@type'] === 'Link') {
		if (person.name) {
			return { name: person.name };
		}
	} else {
		if (person.name) {
			return {
				name: person.name,
				src: person.icon && extractUrlFromIconJsonLd(person.icon),
			};
		}
	}
	return undefined;
};
