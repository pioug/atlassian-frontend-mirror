import { JsonLd } from 'json-ld-types';
import { extractPersonFromJsonLd } from '.';
import { LinkPerson } from './types';
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export type LinkPersonUpdatedBy = Array<LinkPerson>;
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export type LinkTypeUpdatedBy =
  | JsonLd.Data.Document
  | JsonLd.Data.Project
  | JsonLd.Data.SourceCodePullRequest
  | JsonLd.Data.SourceCodeReference
  | JsonLd.Data.SourceCodeRepository
  | JsonLd.Data.Task;
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export const extractPersonUpdatedBy = (
  jsonLd: LinkTypeUpdatedBy,
): LinkPerson | undefined => {
  const updatedBy = jsonLd['atlassian:updatedBy'];
  if (updatedBy) {
    return extractPersonFromJsonLd(
      updatedBy as JsonLd.Primitives.Object | JsonLd.Primitives.Link,
    );
  }
};
