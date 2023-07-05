import { JsonLd } from 'json-ld-types';
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
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
