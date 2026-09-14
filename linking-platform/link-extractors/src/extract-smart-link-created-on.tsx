import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractDateCreated } from './extract-date-created';
import { extractEntity } from './extract-entity';
import { isEntityPresent } from './is-entity-present';
import type { LinkTypeCreated } from './types';

export const extractSmartLinkCreatedOn = (response?: SmartLinkResponse): string | undefined => {
	if (isEntityPresent(response)) {
		return extractEntity(response)?.createdAt;
	}

	return response?.data && extractDateCreated(response.data as LinkTypeCreated);
};
