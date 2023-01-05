import { JsonLd } from 'json-ld-types';
import { extractLozenge } from './extractLozenge';

export const extractLozengeText = (
  response?: JsonLd.Response,
): string | undefined => {
  const data = response?.data as JsonLd.Data.BaseData;
  if (data) {
    const { text } = extractLozenge(data) || {};
    return text;
  }
};
