import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';
import { isBaseEntity } from '@atlaskit/linking-types/is-base-entity';
import { isDesignEntity } from '@atlaskit/linking-types/is-design-entity';
import { isDocumentEntity } from '@atlaskit/linking-types/is-document-entity';

import { extractEntity } from './extract-entity';

export const extractEntityIcon = (
	response?: SmartLinkResponse,
):
	| {
			label: string | undefined;
			url: string | undefined;
	  }
	| undefined => {
	const entity = extractEntity(response);
	if (!entity) {
		return undefined;
	}

	if (!isBaseEntity(entity)) {
		return undefined;
	}

	if (isDesignEntity(entity) && entity.iconUrl) {
		return {
			url: entity.iconUrl,
			label: entity.type,
		};
	}

	if (isDocumentEntity(entity) && entity.type.iconUrl) {
		return {
			url: entity.type.iconUrl,
			label: entity.type.category,
		};
	}

	// When JSON-LD is deprecated, we can change this to returning entity provider icon.
	// For now code upstream will return better result when this method returns undefined.
	return undefined;
};
