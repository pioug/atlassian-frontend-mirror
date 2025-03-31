import { type JsonLd } from '@atlaskit/json-ld-types';

export const getActionsFromJsonLd = (jsonLd: JsonLd.Data.BaseData): JsonLd.Primitives.Action[] => {
	let actions = jsonLd && jsonLd['schema:potentialAction'];
	if (!actions) {
		return [];
	}
	if (actions && !Array.isArray(actions)) {
		actions = [actions];
	}
	return actions;
};
