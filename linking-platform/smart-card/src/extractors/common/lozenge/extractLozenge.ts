import { type JsonLd } from '@atlaskit/json-ld-types';
import { extractType } from '@atlaskit/link-extractors';

import { extractState } from './extractState';
import { extractTag } from './extractTag';
import { extractTaskStatus } from './extractTaskStatus';
import { extractTaskType } from './extractTaskType';
import { type LinkLozenge, type LinkStateType } from './types';

export const extractLozenge = (jsonLd: JsonLd.Data.BaseData): LinkLozenge | undefined => {
	const type = extractType(jsonLd);
	if (type) {
		if (type.includes('atlassian:Task')) {
			const jsonLdTask = jsonLd as JsonLd.Data.Task;
			const lozengeFromTag = extractTag(jsonLdTask);
			const lozengeFromStatus = extractTaskStatus(jsonLdTask);
			const lozengeFromTaskType = extractLozengeFromTaskType(jsonLdTask);
			return lozengeFromTag || lozengeFromStatus || lozengeFromTaskType;
		}

		if (type.includes('atlassian:UndefinedLink')) {
			return { text: 'UNDEFINED', appearance: 'inprogress' };
		}

		// casting it because `extractState` can safely handle missing properties
		return extractState(jsonLd as LinkStateType);
	}
};

const extractLozengeFromTaskType = (jsonLdTask: JsonLd.Data.Task): LinkLozenge | undefined => {
	const taskType = extractTaskType(jsonLdTask);
	if (taskType && taskType.name) {
		return { text: taskType.name, appearance: 'success' };
	}
};
