import { JsonLd } from 'json-ld-types';
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
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
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export const extractDateCreated = (
  jsonLd: LinkTypeCreated,
): string | undefined => {
  if (jsonLd['schema:dateCreated']) {
    return jsonLd['schema:dateCreated'];
  }
};
