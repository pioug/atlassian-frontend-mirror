import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractPersonUpdatedBy } from '@atlaskit/link-extractors/extract-person-updated-by';
import type { LinkTypeUpdatedBy } from '@atlaskit/link-extractors/types';

export const extractModifiedBy = (data: JsonLd.Data.BaseData): string | undefined => {
	const person = extractPersonUpdatedBy(data as LinkTypeUpdatedBy);
	if (person) {
		return person.name;
	}
};
