import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

const extractServerAction = (data?: JsonLd.Data.BaseData): JsonLd.Primitives.ServerAction[] => {
	const actions = data?.['atlassian:serverAction'];
	if (!actions) {
		return [];
	}
	if (actions && !Array.isArray(actions)) {
		return [actions];
	}
	return actions;
};

export default extractServerAction;
