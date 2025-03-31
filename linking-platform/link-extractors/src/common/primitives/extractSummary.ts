import { type JsonLd } from '@atlaskit/json-ld-types';

/**
 * Return link summary
 */
export const extractSummary = (jsonLd: JsonLd.Data.BaseData): string | undefined => {
	if (typeof jsonLd?.summary === 'string') {
		const summary = jsonLd.summary.trim();
		return Boolean(summary) ? summary : undefined;
	}
};
