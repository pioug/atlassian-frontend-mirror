import { JsonLd } from 'json-ld-types';

import { extractUrlFromLinkJsonLd } from './extractUrlFromLinkJsonLd';

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
