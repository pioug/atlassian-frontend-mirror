import { JsonLd } from 'json-ld-types';
import { extractPersonFromJsonLd } from '.';
import { LinkPerson } from './types';

export const extractPersonOwnedBy = (
  jsonLd: JsonLd.Data.BaseData,
): LinkPerson[] | undefined => {
  const ownedBy = jsonLd['atlassian:ownedBy'];
  if (ownedBy) {
    if (Array.isArray(ownedBy)) {
      return ownedBy
        .map(extractPersonFromJsonLd)
        .filter(item => !!item) as LinkPerson[];
    } else {
      const item = extractPersonFromJsonLd(ownedBy);
      if (item) {
        return [item];
      }
    }
  }
};
