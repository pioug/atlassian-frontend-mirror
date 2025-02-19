import { type JsonLd } from 'json-ld-types';

import { extractType } from '@atlaskit/link-extractors';
import { fg } from '@atlaskit/platform-feature-flags';

import { extractState } from './extractState';
import { extractTag } from './extractTag';
import { extractTaskStatus } from './extractTaskStatus';
import { extractTaskType } from './extractTaskType';
import { type LinkLozenge, type LinkStateType } from './types';

const DOC_TYPES = [
	'schema:BlogPosting',
	'schema:TextDigitalDocument',
	'schema:DigitalDocument',
	'schema:PresentationDigitalDocument',
	'schema:SpreadsheetDigitalDocument',
];

export const extractLozenge = (jsonLd: JsonLd.Data.BaseData): LinkLozenge | undefined => {
	const type = extractType(jsonLd);
	if (type) {
		if (fg('linking_platform_show_lozenge_atlassian_state')) {
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

		if (type.includes('atlassian:SourceCodePullRequest')) {
			return extractState(jsonLd as JsonLd.Data.SourceCodePullRequest);
		} else if (type.includes('atlassian:Task')) {
			const jsonLdTask = jsonLd as JsonLd.Data.Task;
			const lozengeFromTag = extractTag(jsonLdTask);
			const lozengeFromStatus = extractTaskStatus(jsonLdTask);
			const lozengeFromTaskType = extractLozengeFromTaskType(jsonLdTask);
			return lozengeFromTag || lozengeFromStatus || lozengeFromTaskType;
		} else if (type.some((types) => DOC_TYPES.includes(types))) {
			const jsonLdDocument = jsonLd as JsonLd.Data.Document;
			const lozengeFromState = extractState(jsonLdDocument);
			return lozengeFromState;
		} else if (type.includes('atlassian:Goal')) {
			const jsonLdProject = jsonLd as JsonLd.Data.Goal;
			const lozengeFromState = extractState(jsonLdProject);
			return lozengeFromState;
		} else if (type.includes('atlassian:Project')) {
			const jsonLdProject = jsonLd as JsonLd.Data.Project;
			const lozengeFromState = extractState(jsonLdProject);
			return lozengeFromState;
		} else if (type.includes('atlassian:UndefinedLink')) {
			return { text: 'UNDEFINED', appearance: 'inprogress' };
		}
	}
};

const extractLozengeFromTaskType = (jsonLdTask: JsonLd.Data.Task): LinkLozenge | undefined => {
	const taskType = extractTaskType(jsonLdTask);
	if (taskType && taskType.name) {
		return { text: taskType.name, appearance: 'success' };
	}
};
