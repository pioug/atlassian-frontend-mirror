import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractPersonAssignedTo } from '@atlaskit/link-extractors/extract-person-assigned-to';

export const extractAssignedTo = (data: JsonLd.Data.BaseData): string | undefined => {
	const person = extractPersonAssignedTo(data as JsonLd.Data.Task | JsonLd.Data.TaskType);
	if (person) {
		return person.name;
	}
};
