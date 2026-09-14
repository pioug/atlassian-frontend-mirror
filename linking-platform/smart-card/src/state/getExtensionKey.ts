import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const getExtensionKey = (details?: JsonLd.Response): string | undefined =>
	details?.meta?.key;
