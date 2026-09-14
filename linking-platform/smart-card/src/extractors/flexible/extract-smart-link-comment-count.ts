import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractEntity } from '@atlaskit/link-extractors/extract-entity';
import { isEntityPresent } from '@atlaskit/link-extractors/is-entity-present';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractCommentCount } from './extract-comment-count';

/**
 * Should be moved to link-extractors when jsonLd is deprecated
 */
export const extractSmartLinkCommentCount = (response?: SmartLinkResponse): number | undefined => {
	if (!response || !response.data) {
		return undefined;
	}

	if (isEntityPresent(response)) {
		const entity = extractEntity(response);
		return entity && 'commentCount' in entity && typeof entity.commentCount === 'number'
			? entity?.commentCount
			: undefined;
	}

	return response?.data && extractCommentCount(response?.data as JsonLd.Data.BaseData);
};
