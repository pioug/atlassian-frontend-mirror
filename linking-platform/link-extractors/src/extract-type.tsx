import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

/*
 * ###########################################################################
 * Primitive JSON-LD extraction
 * ###########################################################################
 *
 * Low-level extractors for scalar values and JSON-LD primitive metadata.
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
	return undefined;
};
