import { JsonLd } from 'json-ld-types';
import { extractUrlFromLinkJsonLd } from './extractUrlFromLinkJsonLd';
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export const extractUrlFromIconJsonLd = (
  icon: JsonLd.Primitives.Link | JsonLd.Primitives.Image,
): string | undefined => {
  if (typeof icon === 'string') {
    return icon;
  } else if (icon['@type'] === 'Link') {
    return extractUrlFromLinkJsonLd(icon);
  } else {
    if (icon.url) {
      return extractUrlFromLinkJsonLd(icon.url);
    }
  }
};
