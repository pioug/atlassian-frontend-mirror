import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractImage } from '@atlaskit/link-extractors/extract-image';

import { MediaType } from '../../constants';
import { type Media } from '../../state/flexible-ui-context/types';

export const extractPreview = (data: JsonLd.Data.BaseData): Media | undefined => {
	if (!data) {
		return undefined;
	}

	const url = extractImage(data);

	return url ? { type: MediaType.Image, url } : undefined;
};
