import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractPersonOwnedBy } from '@atlaskit/link-extractors/extract-person-owned-by';

export const extractOwnedBy = (data: JsonLd.Data.BaseData): string | undefined => {
	const persons = extractPersonOwnedBy(data);
	if (persons && persons.length) {
		return persons[0].name;
	}
};
