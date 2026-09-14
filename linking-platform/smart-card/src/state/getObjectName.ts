import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

/**
 * @deprecated Use extractNameFromJsonLd from @atlaskit/link-extractors/extract-name-from-json-ld instead
 */
export const getObjectName = (details?: JsonLd.Response): string | undefined =>
	(details?.data && 'name' in details.data && details.data.name) || undefined;
