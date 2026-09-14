import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const getResourceType = (details?: JsonLd.Response): string | undefined =>
	details?.meta?.resourceType;
