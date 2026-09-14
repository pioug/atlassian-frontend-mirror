import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractEntity } from './extract-entity';
import { extractPersonCreatedBy } from './extract-person-created-by';
import { isEntityPresent } from './is-entity-present';

export const extractSmartLinkCreatedBy = (response?: SmartLinkResponse): string | undefined => {
	if (!response || !response.data) {
		return undefined;
	}

	if (isEntityPresent(response)) {
		return extractEntity(response)?.createdBy?.displayName;
	}

	const persons = extractPersonCreatedBy(response.data as JsonLd.Data.BaseData);
	return !!persons?.length ? persons[0].name : undefined;
};
