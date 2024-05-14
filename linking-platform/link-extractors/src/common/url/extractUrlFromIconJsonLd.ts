import { type JsonLd } from 'json-ld-types';

import { extractUrlFromLinkJsonLd } from './extractUrlFromLinkJsonLd';

/**
 * Extracts the URL from an icon in JSON-LD format.
 *
 * If the icon is a string, it is assumed to be a URL and is returned as is.
 * If the icon is of type Link or the url property exists, the url is extracted recursively.
 * @returns URL string if one is found, otherwise undefined.
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
