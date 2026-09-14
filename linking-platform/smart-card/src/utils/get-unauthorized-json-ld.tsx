import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { emptyData } from './jsonld';

export const getUnauthorizedJsonLd = (): JsonLd.Response => ({
	meta: {
		visibility: 'restricted',
		access: 'unauthorized',
		auth: [],
		definitionId: 'provider-not-found',
	},
	data: { ...emptyData },
});
