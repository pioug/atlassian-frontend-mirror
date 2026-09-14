import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractEntity } from './extract-entity';
import { extractPersonUpdatedBy } from './extract-person-updated-by';
import { isEntityPresent } from './is-entity-present';
import type { LinkTypeUpdatedBy } from './types';

export const extractSmartLinkModifiedBy = (response?: SmartLinkResponse): string | undefined => {
	if (!response || !response.data) {
		return undefined;
	}

	if (isEntityPresent(response)) {
		return extractEntity(response)?.lastUpdatedBy?.displayName;
	}

	const person = extractPersonUpdatedBy(response.data as LinkTypeUpdatedBy);
	return person ? person.name : undefined;
};
