import { JsonLd } from 'json-ld-types';
import { extractPersonFromJsonLd } from '../utils';
import { LinkPerson } from './types';

export type LinkPersonUpdatedBy = Array<LinkPerson>;
export type LinkTypeUpdatedBy =
  | JsonLd.Data.Document
  | JsonLd.Data.Project
  | JsonLd.Data.SourceCodePullRequest
  | JsonLd.Data.SourceCodeReference
  | JsonLd.Data.SourceCodeRepository
  | JsonLd.Data.Task;

export const extractPersonUpdatedBy = (
  jsonLd: LinkTypeUpdatedBy,
): LinkPerson | undefined => {
  const updatedBy = jsonLd['atlassian:updatedBy'];
  if (updatedBy) {
    return extractPersonFromJsonLd(updatedBy);
  }
};
