import { JsonLd } from 'json-ld-types';

export const extractSummary = (
  jsonLd: JsonLd.Data.BaseData,
): string | undefined => {
  return jsonLd.summary;
};
