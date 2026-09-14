import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractDateUpdated } from './extract-date-updated';
import { extractEntity } from './extract-entity';
import { isEntityPresent } from './is-entity-present';

export const extractSmartLinkModifiedOn = (response?: SmartLinkResponse): string | undefined => {
	if (isEntityPresent(response)) {
		return extractEntity(response)?.lastUpdatedAt;
	}

	return response?.data && extractDateUpdated(response.data as JsonLd.Data.BaseData);
};
