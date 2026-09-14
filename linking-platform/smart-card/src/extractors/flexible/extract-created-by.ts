import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractPersonCreatedBy } from '@atlaskit/link-extractors/extract-person-created-by';

export const extractCreatedBy = (data: JsonLd.Data.BaseData): string | undefined => {
	const persons = extractPersonCreatedBy(data);
	if (persons && persons.length) {
		return persons[0].name;
	}
};
