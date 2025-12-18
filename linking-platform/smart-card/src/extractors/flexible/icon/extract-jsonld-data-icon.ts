import { type JsonLd } from '@atlaskit/json-ld-types';
import { extractTitle } from '@atlaskit/link-extractors';
import { fg } from '@atlaskit/platform-feature-flags';

import { IconType } from '../../../constants';
import { prioritiseIcon } from '../../common/icon';
import { extractorPriorityMap as priorityMap } from '../../common/icon/priority';
import { extractTaskType } from '../../common/lozenge';
import { JIRA_GENERATOR_ID } from '../../constants';

import extractDocumentTypeIcon from './extract-document-type-icon';
import extractFileFormatIcon from './extract-file-formatIcon';
import extractJiraTaskIcon from './extract-jira-task-icon';
import extractProviderIcon from './extract-provider-icon';
import extractUrlIcon from './extract-url-icon';
import { type IconDescriptor } from './types';

const extractTask = (data: JsonLd.Data.Task, label?: string) => {
	const { id, icon: url } = extractTaskType(data as JsonLd.Data.Task) || {};
	const taskType = id?.split('#').pop();
	const taskIcon = url ? { label, url } : undefined;
	return { taskType, taskIcon };
};

const extractType = (jsonLd: JsonLd.Data.BaseData): string => {
	const type = jsonLd['@type'];
	return Array.isArray(type) ? type.sort((a, b) => priorityMap[b] - priorityMap[a])[0] : type;
};

const isJiraProvider = (provider?: string) => provider === JIRA_GENERATOR_ID;

function chooseIcon({
	urlIcon,
	type,
	label,
	data,
	providerIcon,
}: {
	data: JsonLd.Data.BaseData;
	label: string | undefined;
	providerIcon: IconDescriptor | undefined;
	type: string;
	urlIcon: IconDescriptor | undefined;
}) {
	const providerId = (data.generator as JsonLd.Primitives.Object)?.['@id'];
	const fileFormat = (data as JsonLd.Data.Document)?.['schema:fileFormat'];
	const fileFormatIcon = extractFileFormatIcon(fileFormat);
	const documentTypeIcon =
		typeToIconDescriptor({ type, label, providerId, data }) ||
		extractDocumentTypeIcon(type, label, providerId);

	return prioritiseIcon<IconDescriptor>({
		fileFormatIcon,
		documentTypeIcon,
		urlIcon,
		providerIcon,
	});
}

function typeToIconDescriptor({
	type,
	label,
	providerId,
	data,
}: {
	data: JsonLd.Data.BaseData;
	label: string | undefined;
	providerId: string | undefined;
	type: string;
}): IconDescriptor | undefined {
	switch (type) {
		case 'atlassian:Goal':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Task,
						label,
					}
				: {
						icon: IconType.Task,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: label || 'Goal',
					};
		case 'atlassian:Project':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Project,
						label,
					}
				: {
						icon: IconType.Project,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: label || 'Project',
					};
		case 'atlassian:SourceCodeCommit':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Commit,
						label,
					}
				: {
						icon: IconType.Commit,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: label || 'Commit',
					};
		case 'atlassian:SourceCodePullRequest':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.PullRequest,
						label,
					}
				: {
						icon: IconType.PullRequest,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: label || 'Pull request',
					};
		case 'atlassian:SourceCodeReference':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Branch,
						label,
					}
				: {
						icon: IconType.Branch,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: label || 'Reference',
					};
		case 'atlassian:SourceCodeRepository':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Repo,
						label,
					}
				: {
						icon: IconType.Repo,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: label || 'Repository',
					};
		case 'atlassian:Task':
			const taskLabel = label || 'Task';
			const taskIconDescriptor = { icon: IconType.Task, label: taskLabel };
			if (isJiraProvider(providerId)) {
				const { taskType, taskIcon } = extractTask(data as JsonLd.Data.Task);
				return taskType === 'JiraCustomTaskType'
					? taskIcon || taskIconDescriptor
					: extractJiraTaskIcon(taskType, taskLabel);
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
	const label = extractTitle(data);
	const type = extractType(data);
	const urlIcon = extractUrlIcon(data.icon, label);
	const providerIcon = extractProviderIcon(data);

	return chooseIcon({ urlIcon, providerIcon, type, label, data });
};

export default extractJsonldDataIcon;
