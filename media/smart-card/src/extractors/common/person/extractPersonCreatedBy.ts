import { JsonLd } from 'json-ld-types';
import { extractPersonFromJsonLd } from '../utils';
import { LinkPerson } from './types';

export const extractPersonCreatedBy = (
  jsonLd: JsonLd.Data.BaseData,
): LinkPerson[] | undefined => {
  const attributedTo = jsonLd.attributedTo;
  if (attributedTo) {
    if (Array.isArray(attributedTo)) {
      return attributedTo
        .map(extractPersonFromJsonLd)
        .filter((item) => !!item) as LinkPerson[];
    } else {
      const item = extractPersonFromJsonLd(attributedTo);
      if (item) {
        return [item];
      }
    }
  }
};
