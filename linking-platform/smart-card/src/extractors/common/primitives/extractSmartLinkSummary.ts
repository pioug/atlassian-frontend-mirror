import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractEntity } from '@atlaskit/link-extractors/extract-entity';
import { isEntityPresent } from '@atlaskit/link-extractors/is-entity-present';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractSummary } from './extractSummary';

/**
 * Return link summary
 */
export const extractSmartLinkSummary = (response?: SmartLinkResponse): string | undefined => {
	if (isEntityPresent(response)) {
		return extractEntity(response)?.description;
	}

	return response?.data && extractSummary(response.data as JsonLd.Data.BaseData);
};
