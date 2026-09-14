import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const extractVisitUrl = (jsonLd: JsonLd.Data.BaseData): string | undefined => {
	return jsonLd['atlassian:visitUrl'];
};
