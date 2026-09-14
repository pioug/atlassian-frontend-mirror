import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { type LinkLocation } from '../../state/flexible-ui-context/types';
import { extractValue } from './extract-value';

export const extractLocation = (data: JsonLd.Data.BaseData): LinkLocation | undefined => {
	const { url, name } =
		(extractValue<JsonLd.Data.BaseData, JsonLd.Data.Project['location']>(
			data,
			'location',
		) as JsonLd.Data.Project) || {};

	if (url && name && typeof url === 'string') {
		return {
			text: name,
			url,
		};
	}
};
