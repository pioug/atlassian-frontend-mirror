import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const extractAri = (jsonLd: JsonLd.Data.BaseData): string | undefined => {
	if (jsonLd['atlassian:ari']) {
		return jsonLd['atlassian:ari'];
	}
	return undefined;
};
