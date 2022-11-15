import { JsonLd } from 'json-ld-types';
import {
  extractPersonFromJsonLd,
  LinkPerson,
} from '@atlaskit/linking-common/extractors';

export type LinkTypeUpdatedBy =
  | JsonLd.Data.Document
  | JsonLd.Data.Project
  | JsonLd.Data.SourceCodePullRequest
  | JsonLd.Data.SourceCodeReference
  | JsonLd.Data.SourceCodeRepository
  | JsonLd.Data.Task;

// Temporary Extractor until https://product-fabric.atlassian.net/browse/EDM-2652 is ready
export const extractPersonsUpdatedBy = (
  jsonLd: LinkTypeUpdatedBy,
): LinkPerson[] | undefined => {
  const updatedBy = jsonLd['atlassian:updatedBy'] as
    | JsonLd.Primitives.Object
    | JsonLd.Primitives.Link;
  if (updatedBy) {
    const extractedPersons = extractPersonFromJsonLd(updatedBy);
    return extractedPersons ? [extractedPersons] : undefined;
  }
};
