import { type JsonLd } from '@atlaskit/json-ld-types';

import { extractUrlFromLinkJsonLd } from '../url';

/**
 * @deprecated Use extractSmartLinkUrl instead
 */
export const extractLink = (jsonLd: JsonLd.Data.BaseData): string | undefined => {
	const url = jsonLd?.url;
	if (url) {
		if (typeof url === 'string') {
			return url;
		} else {
			return extractUrlFromLinkJsonLd(url);
		}
	}
	return undefined;
};
