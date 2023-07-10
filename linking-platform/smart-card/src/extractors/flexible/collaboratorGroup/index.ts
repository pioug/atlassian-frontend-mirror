import { JsonLd } from 'json-ld-types';
import {
  extractMembers,
  extractPersonFromJsonLd,
  LinkPerson,
} from '@atlaskit/link-extractors';

export type LinkTypeUpdatedBy =
  | JsonLd.Data.Document
  | JsonLd.Data.Project
  | JsonLd.Data.SourceCodePullRequest
  | JsonLd.Data.SourceCodeReference
  | JsonLd.Data.SourceCodeRepository
  | JsonLd.Data.Task;

export const extractPersonsUpdatedBy = (
  jsonLd: LinkTypeUpdatedBy,
): LinkPerson[] | undefined => {
  if (jsonLd['@type'] === 'atlassian:Project') {
    const members = extractMembers(jsonLd as JsonLd.Data.Project);
    if (members && members.length !== 0) {
      return members;
    }
  }
  const updatedBy = jsonLd['atlassian:updatedBy'] as
    | JsonLd.Primitives.Object
    | JsonLd.Primitives.Link;

  if (updatedBy) {
    const extractedPersons = extractPersonFromJsonLd(updatedBy);
    return extractedPersons ? [extractedPersons] : undefined;
  }
};
