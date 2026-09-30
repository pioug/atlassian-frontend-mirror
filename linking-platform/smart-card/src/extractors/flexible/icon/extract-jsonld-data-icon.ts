import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { IconType } from '../../../constants';
import { prioritiseIcon } from '../../common/icon/prioritiseIcon';
import { extractorPriorityMap as priorityMap } from '../../common/icon/priority';
import { extractTaskType } from '../../common/lozenge/extractTaskType';
import { JIRA_GENERATOR_ID } from '../../constants';
import extractDocumentTypeIcon from './extract-document-type-icon';
import extractFileFormatIcon from './extract-file-formatIcon';
import extractJiraTaskIcon from './extract-jira-task-icon';
import extractProviderIcon from './extract-provider-icon';
import extractUrlIcon from './extract-url-icon';
import { type IconDescriptor } from './types';

const extractTask = (data: JsonLd.Data.Task) => {
	const { id, icon: url, name } = extractTaskType(data) || {};
	const taskType = id?.split('#').pop();
	const taskIconLabel = name?.trim() || 'Task';
	const taskIcon = url ? { label: taskIconLabel, url } : undefined;
	return { taskType, taskIcon };
};

const extractType = (jsonLd: JsonLd.Data.BaseData): JsonLd.Primitives.ObjectType => {
	const type = jsonLd['@type'];
	return Array.isArray(type) ? type.sort((a, b) => priorityMap[b] - priorityMap[a])[0] : type;
};

const isJiraProvider = (provider?: string) => provider === JIRA_GENERATOR_ID;

function chooseIcon({
	type,
	data,
	providerIcon,
}: {
	data: JsonLd.Data.BaseData;
	providerIcon: IconDescriptor | undefined;
	type: JsonLd.Primitives.ObjectType;
}) {
	const providerId = (data.generator as JsonLd.Primitives.Object)?.['@id'];
	const fileFormat = (data as JsonLd.Data.Document)?.['schema:fileFormat'];
	const fileFormatIcon = extractFileFormatIcon(fileFormat);

	const iconDescriptor = typeToIconDescriptor({ type, providerId, data });
	const extractedDocumentTypeIcon = extractDocumentTypeIcon(type, providerId);
	const documentTypeIcon = iconDescriptor || extractedDocumentTypeIcon;
	const urlIcon = extractUrlIcon(data.icon, documentTypeIcon?.label);

	return prioritiseIcon<IconDescriptor>({
		fileFormatIcon,
		documentTypeIcon,
		urlIcon,
		providerIcon,
	});
}

function typeToIconDescriptor({
	type,
	providerId,
	data,
}: {
	data: JsonLd.Data.BaseData;
	providerId: string | undefined;
	type: JsonLd.Primitives.ObjectType;
}): IconDescriptor | undefined {
	const getIconDescriptor = (icon: IconType, label: string): IconDescriptor => ({ icon, label });
	switch (type) {
		case 'atlassian:Goal':
			return getIconDescriptor(IconType.Task, 'goal');
		case 'atlassian:Project':
			// FIXME: atlassian:Project seem to be returned for many things, including Confluence space or Trello board,
			// But `IconType.Project` actual value is `BitBucket:Project`!
			return getIconDescriptor(IconType.Project, 'project');
		case 'atlassian:SourceCodeCommit':
			return getIconDescriptor(IconType.Commit, 'commit');
		case 'atlassian:SourceCodePullRequest':
			return getIconDescriptor(IconType.PullRequest, 'pull request');
		case 'atlassian:SourceCodeReference':
			return getIconDescriptor(IconType.Branch, 'branch');
		case 'atlassian:SourceCodeRepository':
			return getIconDescriptor(IconType.Repo, 'repository');
		case 'atlassian:Task':
			const taskIconDescriptor = { icon: IconType.Task, label: 'task' };
			if (isJiraProvider(providerId)) {
				const { taskType, taskIcon } = extractTask(data as JsonLd.Data.Task);
				return taskType === 'JiraCustomTaskType'
					? taskIcon || taskIconDescriptor
					: extractJiraTaskIcon(taskType);
			}
			return taskIconDescriptor;
		default:
			return undefined;
	}
}

/**
 * Return the icon object given a JSON-LD data object.
 */
const extractJsonldDataIcon = (data: JsonLd.Data.BaseData): IconDescriptor | undefined => {
	const type = extractType(data);
	const providerIcon = extractProviderIcon(data);

	return chooseIcon({ type, data, providerIcon });
};

export default extractJsonldDataIcon;
