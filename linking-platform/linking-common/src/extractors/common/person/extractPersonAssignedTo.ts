import { JsonLd } from 'json-ld-types';
import { extractPersonFromJsonLd } from '.';
import { LinkPerson } from './types';
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export type LinkTypeAssignedTo = JsonLd.Data.Task | JsonLd.Data.TaskType;
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export const extractPersonAssignedTo = (
  jsonLd: LinkTypeAssignedTo,
): LinkPerson | undefined => {
  const assignedTo = jsonLd['atlassian:assignedTo'];
  if (assignedTo) {
    return extractPersonFromJsonLd(assignedTo);
  }
};
