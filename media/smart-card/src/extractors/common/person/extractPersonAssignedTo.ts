import { JsonLd } from 'json-ld-types';
import { extractPersonFromJsonLd } from '../utils';
import { LinkPerson } from './types';

export type LinkTypeAssignedTo = JsonLd.Data.Task | JsonLd.Data.TaskType;

export const extractPersonAssignedTo = (
  jsonLd: LinkTypeAssignedTo,
): LinkPerson | undefined => {
  const assignedTo = jsonLd['atlassian:assignedTo'];
  if (assignedTo) {
    return extractPersonFromJsonLd(assignedTo);
  }
};
