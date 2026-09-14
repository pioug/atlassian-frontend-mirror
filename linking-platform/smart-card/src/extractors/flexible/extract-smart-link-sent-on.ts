import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractEntity } from '@atlaskit/link-extractors/extract-entity';
import { isEntityPresent } from '@atlaskit/link-extractors/is-entity-present';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractSentOn } from './extract-sent-on';

/**
 * Should be moved to link-extractors when jsonLd is deprecated
 */
export const extractSmartLinkSentOn = (response?: SmartLinkResponse): string | undefined => {
	if (!response || !response.data) {
		return undefined;
	}

	if (isEntityPresent(response)) {
		return extractEntity(response)?.createdAt;
	}

	return response?.data && extractSentOn(response?.data as JsonLd.Data.BaseData);
};
