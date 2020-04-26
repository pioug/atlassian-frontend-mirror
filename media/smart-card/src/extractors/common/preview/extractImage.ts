import { JsonLd } from 'json-ld-types';
import { extractUrlFromLinkJsonLd } from '../utils';

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
