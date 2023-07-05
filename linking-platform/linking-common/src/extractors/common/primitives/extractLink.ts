import { JsonLd } from 'json-ld-types';
import { extractUrlFromLinkJsonLd } from '../url';
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export const extractLink = (
  jsonLd: JsonLd.Data.BaseData,
): string | undefined => {
  const url = jsonLd.url;
  if (url) {
    if (typeof url === 'string') {
      return url;
    } else {
      return extractUrlFromLinkJsonLd(url);
    }
  }
};
