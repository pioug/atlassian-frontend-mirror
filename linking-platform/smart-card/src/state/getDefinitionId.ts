import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const getDefinitionId = (details?: JsonLd.Response): string | undefined =>
	details?.meta?.definitionId;
