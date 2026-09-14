import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractVisitUrl } from '../extractors/common/primitives/extractVisitUrl';

export const getClickUrl = (url: string, jsonLd?: JsonLd.Response): string => {
	if (jsonLd && jsonLd.data) {
		const visitUrl = extractVisitUrl(jsonLd.data as JsonLd.Data.BaseData);
		if (visitUrl) {
			return visitUrl;
		}
	}
	return url;
};
