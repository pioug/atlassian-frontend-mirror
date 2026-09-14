import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractValue } from './extract-value';

export const extractSubTasksProgress = (data: JsonLd.Data.BaseData): string | undefined => {
	const subTasksObject = extractValue<JsonLd.Data.Task, JsonLd.Primitives.SubTasksProgress>(
		data,
		'atlassian:subTasks',
	);
	return subTasksObject && subTasksObject.totalCount
		? `${subTasksObject.resolvedCount}/${subTasksObject.totalCount}`
		: undefined;
};
