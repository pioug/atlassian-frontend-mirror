import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractPersonAssignedTo } from '@atlaskit/link-extractors/extract-person-assigned-to';
import type { LinkPerson } from '@atlaskit/link-extractors/types';

export const extractPersonAssignedToAsArray = (
	data: JsonLd.Data.BaseData,
): LinkPerson[] | undefined => {
	const person = extractPersonAssignedTo(data as JsonLd.Data.Task | JsonLd.Data.TaskType);
	return person ? [person] : undefined;
};
