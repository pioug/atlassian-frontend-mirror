import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractEntity } from './extract-entity';
import { extractPersonCreatedBy } from './extract-person-created-by';
import { isEntityPresent } from './is-entity-present';
import type { LinkPerson } from './types';

export const extractSmartLinkAuthorGroup = (
	response: SmartLinkResponse,
): LinkPerson[] | undefined => {
	if (!response || !response.data) {
		return undefined;
	}

	if (isEntityPresent(response)) {
		const entity = extractEntity(response);
		const owners = entity?.owners;

		if (owners) {
			return owners
				.map((owner) => ({ name: owner.displayName, src: owner.picture }))
				.filter((item) => !!item) as LinkPerson[];
		}
	}

	return extractPersonCreatedBy(response.data as JsonLd.Data.BaseData);
};
