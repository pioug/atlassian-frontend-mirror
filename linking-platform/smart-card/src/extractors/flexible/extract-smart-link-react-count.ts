import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractEntity } from '@atlaskit/link-extractors/extract-entity';
import { isEntityPresent } from '@atlaskit/link-extractors/is-entity-present';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractReactCount } from './extract-react-count';

/**
 * Should be moved to link-extractors when jsonLd is deprecated
 */
export const extractSmartLinkReactCount = (response?: SmartLinkResponse): number | undefined => {
	if (!response || !response.data) {
		return undefined;
	}

	if (isEntityPresent(response)) {
		const entity = extractEntity(response);
		const reactions =
			entity && 'reactions' in entity && Array.isArray(entity.reactions)
				? entity.reactions
				: undefined;
		return reactions?.reduce((total, reaction) => total + reaction?.total, 0);
	}

	return response?.data && extractReactCount(response?.data as JsonLd.Data.BaseData);
};
