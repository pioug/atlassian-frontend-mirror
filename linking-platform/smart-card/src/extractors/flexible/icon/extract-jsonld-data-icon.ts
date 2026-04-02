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

const extractTaskNew = (data: JsonLd.Data.Task) => {
	const taskTypeInfo = extractTaskType(data as JsonLd.Data.Task) || {};
	const { id, icon: url, name } = taskTypeInfo;
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
	urlIcon, // NAVX-4354: remove this during cleanup
	type,
	label, // NAVX-4354: remove this during cleanup
	data,
	providerIcon,
}: {
	data: JsonLd.Data.BaseData;
	label?: string | undefined; // NAVX-4354: remove this during cleanup
	providerIcon: IconDescriptor | undefined;
	type: JsonLd.Primitives.ObjectType;
	urlIcon?: IconDescriptor | undefined; // NAVX-4354: remove this during cleanup
}) {
	const providerId = (data.generator as JsonLd.Primitives.Object)?.['@id'];
	const fileFormat = (data as JsonLd.Data.Document)?.['schema:fileFormat'];
	const fileFormatIcon = extractFileFormatIcon(fileFormat);

	if (fg('platform_navx_smart_link_icon_label_a11y')) {
		const iconDescriptor = typeToIconDescriptor({ type, providerId, data });
		const documentTitle = fg('platform_navx_smart_link_icon_label_a11y')
			? undefined
			: extractTitle(data);
		const extractedDocumentTypeIcon = extractDocumentTypeIcon(type, documentTitle, providerId);

		const documentTypeIcon = iconDescriptor || extractedDocumentTypeIcon;

		const urlIconNew = extractUrlIcon(data.icon, documentTypeIcon?.label);

		return prioritiseIcon<IconDescriptor>({
			fileFormatIcon,
			documentTypeIcon,
			urlIcon: urlIconNew,
			providerIcon,
		});
	} else {
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
}

function typeToIconDescriptor({
	type,
	label, // NAVX-4354: remove this during cleanup
	providerId,
	data,
}: {
	data: JsonLd.Data.BaseData;
	label?: string; // NAVX-4354: remove this during cleanup
	providerId: string | undefined;
	type: JsonLd.Primitives.ObjectType;
}): IconDescriptor | undefined {
	const descriptorLabel = (semantic: string) =>
		fg('platform_navx_smart_link_icon_label_a11y') ? semantic : label;

	switch (type) {
		case 'atlassian:Goal':
			return {
				icon: IconType.Task,
				label: descriptorLabel('goal'),
			};
		case 'atlassian:Project':
			return {
				// FIXME: atlassian:Project seem to be returned for many things, including Confluence space or Trello board,
				// But `IconType.Project` actual value is `BitBucket:Project`!
				icon: IconType.Project,
				label: descriptorLabel('project'),
			};
		case 'atlassian:SourceCodeCommit':
			return {
				icon: IconType.Commit,
				label: descriptorLabel('commit'),
			};
		case 'atlassian:SourceCodePullRequest':
			return {
				icon: IconType.PullRequest,
				label: descriptorLabel('pull request'),
			};
		case 'atlassian:SourceCodeReference':
			return {
				icon: IconType.Branch,
				label: descriptorLabel('branch'),
			};
		case 'atlassian:SourceCodeRepository':
			return {
				icon: IconType.Repo,
				label: descriptorLabel('repository'),
			};
		case 'atlassian:Task':
			if (fg('platform_navx_smart_link_icon_label_a11y')) {
				const taskIconDescriptor = { icon: IconType.Task, label: descriptorLabel('task') };
				if (isJiraProvider(providerId)) {
					const { taskType, taskIcon } = extractTaskNew(data as JsonLd.Data.Task);
					return taskType === 'JiraCustomTaskType'
						? taskIcon || taskIconDescriptor
						: extractJiraTaskIcon(taskType);
				}
				return taskIconDescriptor;
			} else {
				const taskLabel = label || 'Task';
				const taskIconDescriptor = { icon: IconType.Task, label: taskLabel };
				if (isJiraProvider(providerId)) {
					const { taskType, taskIcon } = extractTask(data as JsonLd.Data.Task);
					return taskType === 'JiraCustomTaskType'
						? taskIcon || taskIconDescriptor
						: extractJiraTaskIcon(taskType, taskLabel);
				}
				return taskIconDescriptor;
			}
		default:
			return undefined;
	}
}

/**
 * Return the icon object given a JSON-LD data object.
 */
const extractJsonldDataIcon = (data: JsonLd.Data.BaseData): IconDescriptor | undefined => {
	if (fg('platform_navx_smart_link_icon_label_a11y')) {
		const type = extractType(data);
		const providerIcon = extractProviderIcon(data);

		return chooseIcon({ type, data, providerIcon });
	} else {
		const label = extractTitle(data);
		const type = extractType(data);
		const urlIcon = extractUrlIcon(data.icon, label);
		const providerIcon = extractProviderIcon(data);

		return chooseIcon({ urlIcon, providerIcon, type, label, data });
	}
};

export default extractJsonldDataIcon;
