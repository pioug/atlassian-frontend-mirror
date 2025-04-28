import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractEntity,
	extractEntityProvider,
	extractImage,
	isEntityPresent,
} from '@atlaskit/link-extractors';
import { SmartLinkResponse } from '@atlaskit/linking-types';

import { MediaType } from '../../constants';
import { type Media } from '../../state/flexible-ui-context/types';

const extractPreview = (data: JsonLd.Data.BaseData): Media | undefined => {
	if (!data) {
		return undefined;
	}

	const url = extractImage(data);

	return url ? { type: MediaType.Image, url } : undefined;
};

export default extractPreview;

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

		if (!url) {
			const provider = extractEntityProvider(response);
			url = provider?.image;
		}

		return url ? { type: MediaType.Image, url } : undefined;
	}

	return extractPreview(response.data as JsonLd.Data.BaseData);
};
