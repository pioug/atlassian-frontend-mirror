import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractEntity } from './extract-entity';
import { isEntityPresent } from './is-entity-present';

export const extractSmartLinkDownloadUrl = (response?: SmartLinkResponse): string | undefined => {
	if (isEntityPresent(response)) {
		const entity = extractEntity(response);
		return entity &&
			'exportLinks' in entity &&
			Array.isArray(entity.exportLinks) &&
			entity.exportLinks.length > 0
			? entity?.exportLinks?.[0].url
			: undefined;
	}
	return (response?.data as JsonLd.Data.BaseData)?.['atlassian:downloadUrl'];
};
