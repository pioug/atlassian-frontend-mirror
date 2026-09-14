import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const extractTeamMemberCount = (data: JsonLd.Data.BaseData): number => {
	const val = data?.attributedTo
		? Array.isArray(data?.attributedTo)
			? data?.attributedTo.length
			: 0
		: 0;
	return val;
};
