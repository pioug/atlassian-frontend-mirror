import { JsonLd } from 'json-ld-types';
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export const extractDateUpdated = (
  jsonLd: JsonLd.Data.BaseData,
): string | undefined => {
  if (jsonLd.updated) {
    return jsonLd.updated;
  }
};
