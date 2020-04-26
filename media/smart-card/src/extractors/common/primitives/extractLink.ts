import { JsonLd } from 'json-ld-types';
import { extractUrlFromLinkJsonLd } from '../utils';

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
