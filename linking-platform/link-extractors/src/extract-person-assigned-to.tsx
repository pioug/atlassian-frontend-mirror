import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractPersonFromJsonLd } from './extract-person-from-json-ld';
import type { LinkPerson } from './types';

type LinkTypeAssignedTo = JsonLd.Data.Task | JsonLd.Data.TaskType;

export const extractPersonAssignedTo = (jsonLd: LinkTypeAssignedTo): LinkPerson | undefined => {
	const assignedTo = jsonLd['atlassian:assignedTo'];
	if (assignedTo) {
		return extractPersonFromJsonLd(assignedTo);
	}
	return undefined;
};
