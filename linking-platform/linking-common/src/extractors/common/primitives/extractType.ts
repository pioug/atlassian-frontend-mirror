import { JsonLd } from 'json-ld-types';

export const extractType = (
  jsonLd: JsonLd.Primitives.Object,
): JsonLd.Primitives.ObjectType[] | undefined => {
  const type = jsonLd['@type'];
  if (type) {
    if (Array.isArray(jsonLd['@type'])) {
      return type as JsonLd.Primitives.ObjectType[];
    } else {
      return [type as JsonLd.Primitives.ObjectType];
    }
  }
};
