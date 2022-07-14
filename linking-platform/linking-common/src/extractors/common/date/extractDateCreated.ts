import { JsonLd } from 'json-ld-types';

export type LinkTypeCreated =
  | JsonLd.Data.Document
  | JsonLd.Data.Page
  | JsonLd.Data.Project
  | JsonLd.Data.SourceCodeCommit
  | JsonLd.Data.SourceCodePullRequest
  | JsonLd.Data.SourceCodeReference
  | JsonLd.Data.SourceCodeRepository
  | JsonLd.Data.Task
  | JsonLd.Data.TaskType;

export const extractDateCreated = (
  jsonLd: LinkTypeCreated,
): string | undefined => {
  if (jsonLd['schema:dateCreated']) {
    return jsonLd['schema:dateCreated'];
  }
};
