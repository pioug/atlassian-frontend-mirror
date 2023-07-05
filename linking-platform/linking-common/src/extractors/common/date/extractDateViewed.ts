import { JsonLd } from 'json-ld-types';
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export const extractDateViewed = (
  jsonLd: JsonLd.Data.Document,
): string | undefined => {
  if (jsonLd['atlassian:dateViewed']) {
    return jsonLd['atlassian:dateViewed'];
  }
};
