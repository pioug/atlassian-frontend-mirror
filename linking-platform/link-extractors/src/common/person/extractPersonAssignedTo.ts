import { type JsonLd } from '@atlaskit/json-ld-types';

import { type LinkPerson } from './types';

import { extractPersonFromJsonLd } from './index';

export type LinkTypeAssignedTo = JsonLd.Data.Task | JsonLd.Data.TaskType;

export const extractPersonAssignedTo = (jsonLd: LinkTypeAssignedTo): LinkPerson | undefined => {
	const assignedTo = jsonLd['atlassian:assignedTo'];
	if (assignedTo) {
		return extractPersonFromJsonLd(assignedTo);
	}
};
