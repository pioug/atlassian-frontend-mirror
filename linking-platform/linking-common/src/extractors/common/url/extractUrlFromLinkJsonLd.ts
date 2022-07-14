import { JsonLd } from 'json-ld-types';

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
