import { type JsonLd } from '@atlaskit/json-ld-types';

export const extractAri = (jsonLd: JsonLd.Data.BaseData): string | undefined => {
	if (jsonLd['atlassian:ari']) {
		return jsonLd['atlassian:ari'];
	}
};
