import { JsonLd } from 'json-ld-types';
import { extractUrlFromLinkJsonLd } from '../url';
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export const extractImage = (
  jsonLd: JsonLd.Data.BaseData,
): string | undefined => {
  const image = jsonLd.image;
  if (image) {
    if (typeof image === 'string') {
      return image;
    } else if (image['@type'] === 'Link') {
      return extractUrlFromLinkJsonLd(image);
    } else if (image['@type'] === 'Image') {
      if (image.url) {
        return extractUrlFromLinkJsonLd(image.url);
      }
    }
  }
};
