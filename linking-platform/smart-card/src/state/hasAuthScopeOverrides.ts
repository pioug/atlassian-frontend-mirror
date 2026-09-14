import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const hasAuthScopeOverrides = (details?: JsonLd.Response): boolean =>
	!!details?.meta.hasScopeOverrides;
