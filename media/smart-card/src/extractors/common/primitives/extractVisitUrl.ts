import { JsonLd } from 'json-ld-types';

export const extractVisitUrl = (
  jsonLd: JsonLd.Data.BaseData,
): string | undefined => {
  return jsonLd['atlassian:visitUrl'];
};
