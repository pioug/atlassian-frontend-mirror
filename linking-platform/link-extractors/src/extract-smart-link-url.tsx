import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractEntity } from './extract-entity';
import { extractLink } from './extract-link';
import { isEntityPresent } from './is-entity-present';

export const extractSmartLinkUrl = (response?: SmartLinkResponse): string | undefined => {
	if (isEntityPresent(response)) {
		return extractEntity(response)?.url;
	}

	return extractLink(response?.data as JsonLd.Data.BaseData);
};
