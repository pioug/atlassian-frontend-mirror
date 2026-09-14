import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const extractUserAttributes = (
	data: JsonLd.Data.BaseData,
): JsonLd.Primitives.UserAttributes | undefined => {
	return data?.userAttributes;
};
