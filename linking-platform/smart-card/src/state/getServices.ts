import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const getServices = (details?: JsonLd.Response): JsonLd.Primitives.AuthService[] =>
	(details && details.meta.auth) || [];
