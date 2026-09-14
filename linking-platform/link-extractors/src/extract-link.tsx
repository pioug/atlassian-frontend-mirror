import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractUrlFromLinkJsonLd } from './extract-url-from-link-json-ld';

/**
 * @deprecated Use `import { extractSmartLinkUrl } from '@atlaskit/link-extractors/extract-smart-link-url'` instead.
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
