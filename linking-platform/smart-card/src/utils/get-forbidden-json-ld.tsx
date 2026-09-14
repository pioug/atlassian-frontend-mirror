import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { emptyData } from './jsonld';

export const getForbiddenJsonLd = (): JsonLd.Response => ({
	meta: {
		visibility: 'restricted',
		access: 'forbidden',
		auth: [],
		definitionId: 'provider-not-found',
	},
	data: { ...emptyData },
});
