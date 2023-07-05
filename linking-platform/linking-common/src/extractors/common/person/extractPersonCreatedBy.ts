import { JsonLd } from 'json-ld-types';
import { extractPersonFromJsonLd } from '.';
import { LinkPerson } from './types';
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export const extractPersonCreatedBy = (
  jsonLd: JsonLd.Data.BaseData,
): LinkPerson[] | undefined => {
  const attributedTo = jsonLd.attributedTo;
  if (attributedTo) {
    if (Array.isArray(attributedTo)) {
      return attributedTo
        .map(extractPersonFromJsonLd)
        .filter(item => !!item) as LinkPerson[];
    } else {
      const item = extractPersonFromJsonLd(attributedTo);
      if (item) {
        return [item];
      }
    }
  }
};
