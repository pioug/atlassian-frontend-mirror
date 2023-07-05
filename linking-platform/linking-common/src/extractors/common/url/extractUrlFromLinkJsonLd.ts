import { JsonLd } from 'json-ld-types';
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export const extractUrlFromLinkJsonLd = (
  link: JsonLd.Primitives.Link | JsonLd.Primitives.Link[],
): string | undefined => {
  if (typeof link === 'string') {
    return link;
  } else if (Array.isArray(link)) {
    if (link.length > 0) {
      return extractUrlFromLinkJsonLd(link[0]);
    }
  } else {
    return link.href;
  }
};
