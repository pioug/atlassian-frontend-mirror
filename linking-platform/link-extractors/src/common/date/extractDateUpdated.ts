import { type JsonLd } from '@atlaskit/json-ld-types';

export const extractDateUpdated = (jsonLd: JsonLd.Data.BaseData): string | undefined => {
	if (jsonLd.updated) {
		return jsonLd.updated;
	}
	return undefined;
};
