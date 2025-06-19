import { type JsonLd } from '@atlaskit/json-ld-types';
import { extractEntity, isEntityPresent } from '@atlaskit/link-extractors';
import type { SmartLinkResponse } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

/**
 * Return link summary
 */
export const extractSummary = (jsonLd: JsonLd.Data.BaseData): string | undefined => {
	if (typeof jsonLd?.summary === 'string') {
		const summary = jsonLd.summary.trim();
		return Boolean(summary) ? summary : undefined;
	}
};

/**
 * Return link summary
 */
export const extractSmartLinkSummary = (response?: SmartLinkResponse): string | undefined => {
	if (fg('smart_links_noun_support')) {
		if (isEntityPresent(response)) {
			return extractEntity(response)?.description;
		}
	}

	return response?.data && extractSummary(response.data as JsonLd.Data.BaseData);
};
