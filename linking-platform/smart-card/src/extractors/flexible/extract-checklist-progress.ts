import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractValue } from './extract-value';

type LinkChecklistProgressType =
	| JsonLd.Data.Document
	| JsonLd.Data.Task
	| JsonLd.Data.TaskType
	| JsonLd.Data.Project;

export const extractChecklistProgress = (data: JsonLd.Data.BaseData): string | undefined => {
	const checkItemsObj = extractValue<
		LinkChecklistProgressType,
		LinkChecklistProgressType['atlassian:checkItems']
	>(data, 'atlassian:checkItems');
	return checkItemsObj ? `${checkItemsObj.checkedItems}/${checkItemsObj.totalItems}` : undefined;
};
