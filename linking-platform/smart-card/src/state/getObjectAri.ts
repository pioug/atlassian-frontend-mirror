import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

/**
 * @deprecated Use extractAri from @atlaskit/link-extractors instead
 */
export const getObjectAri = (details?: JsonLd.Response): string | undefined =>
	(details?.data && 'atlassian:ari' in details.data && details.data['atlassian:ari']) || undefined;
