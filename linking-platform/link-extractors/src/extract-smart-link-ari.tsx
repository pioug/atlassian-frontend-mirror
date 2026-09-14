import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractAri } from './extract-ari';
import { extractEntity } from './extract-entity';
import { isEntityPresent } from './is-entity-present';

export const extractSmartLinkAri = (response?: SmartLinkResponse): string | undefined => {
	if (isEntityPresent(response)) {
		return extractEntity(response)?.ari || extractEntity(response)?.thirdPartyAri;
	}

	const data = response?.data as JsonLd.Data.BaseData;
	return extractAri(data);
};
