import type { JsonLd } from '@atlaskit/json-ld-types';

export const extractNameFromJsonLd = (details?: JsonLd.Response): string | undefined =>
	(details?.data && 'name' in details.data && details.data.name) || undefined;
