import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractEntity } from '@atlaskit/link-extractors/extract-entity';
import { isEntityPresent } from '@atlaskit/link-extractors/is-entity-present';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { MediaType } from '../../constants';
import { type Media } from '../../state/flexible-ui-context/types';
import { extractPreview } from './extract-preview';

/**
 * Should be moved to link-extractors when jsonLd is deprecated
 */
export const extractSmartLinkPreviewImage = (response?: SmartLinkResponse): Media | undefined => {
	if (!response || !response?.data) {
		return undefined;
	}

	if (isEntityPresent(response)) {
		const entity = extractEntity(response);
		let url = entity?.thumbnail?.externalUrl;

		return url ? { type: MediaType.Image, url } : undefined;
	}

	return extractPreview(response.data as JsonLd.Data.BaseData);
};
