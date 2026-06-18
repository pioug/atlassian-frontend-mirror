import React from 'react';

import DocumentFilledIcon from '@atlaskit/icon/core/file';
import PeopleGroupIcon from '@atlaskit/icon/core/people-group';
import { type JsonLd } from '@atlaskit/json-ld-types';
import { type SmartLinkResponse } from '@atlaskit/linking-types';
import BranchObject from '@atlaskit/object/branch';
import BugObject from '@atlaskit/object/bug';
import ChangesObject from '@atlaskit/object/changes';
import CodeObject from '@atlaskit/object/code';
import CommitObject from '@atlaskit/object/commit';
import EpicObject from '@atlaskit/object/epic';
import IncidentObject from '@atlaskit/object/incident';
import ProblemObject from '@atlaskit/object/problem';
import PullRequestObject from '@atlaskit/object/pull-request';
import StoryObject from '@atlaskit/object/story';
import SubtaskObject from '@atlaskit/object/subtask';
import TaskObject from '@atlaskit/object/task';
import WorkItemObject from '@atlaskit/object/work-item';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	CONFLUENCE_GENERATOR_ID,
	JIRA_BUG,
	JIRA_CHANGE,
	JIRA_CUSTOM_TASK_TYPE,
	JIRA_EPIC,
	JIRA_GENERATOR_ID,
	JIRA_INCIDENT,
	JIRA_PROBLEM,
	JIRA_SERVICE_REQUEST,
	JIRA_STORY,
	JIRA_SUB_TASK,
	JIRA_TASK,
} from './constants';
import { getIconForFileType } from './get-icon-for-file-type';

import {
	extractEntityIcon,
	extractEntityProvider,
	extractProvider,
	extractTitle,
	extractUrlFromIconJsonLd,
	isConfluenceGenerator,
	isEntityPresent,
	type LinkProvider,
} from './index';

type IconPriority = 'type' | 'provider';
type SmartLinkInlineIcon = React.ReactNode | [string | undefined, string | undefined];

interface IconOpts {
	fileFormat?: string;
	icon?: string;
	priority?: IconPriority;
	provider?: LinkProvider;
	showIconLabel?: boolean;
	taskType?: LinkTaskType;
	title?: string;
}

interface LinkTaskType {
	icon?: string;
	id?: string;
	name?: string;
}

type IconPriorityOpts<T> = {
	documentTypeIcon: T | undefined;
	fileFormatIcon: T | undefined;
	providerIcon: T | undefined;
	urlIcon: T | undefined;
};

type JsonLdType = JsonLd.Primitives.ObjectType | 'atlassian:Template';

type DocumentType =
	| 'Document'
	| 'schema:BlogPosting'
	| 'schema:DigitalDocument'
	| 'schema:TextDigitalDocument'
	| 'schema:PresentationDigitalDocument'
	| 'schema:SpreadsheetDigitalDocument'
	| 'atlassian:Template'
	| 'atlassian:UndefinedLink';

const extractorPriorityMap: Record<JsonLdType, number> = {
	Object: 0,
	Document: 5,
	'schema:TextDigitalDocument': 10,
	'schema:DigitalDocument': 10,
	'schema:BlogPosting': 10,
	'schema:SpreadsheetDigitalDocument': 10,
	'schema:PresentationDigitalDocument': 10,
	'atlassian:Goal': 10,
	'atlassian:Task': 10,
	'atlassian:Project': 10,
	'atlassian:Template': 10,
	'atlassian:SourceCodeCommit': 10,
	'atlassian:SourceCodeRepository': 10,
	'atlassian:SourceCodePullRequest': 10,
	'atlassian:SourceCodeReference': 10,
	'atlassian:UndefinedLink': 10,
} as Record<JsonLdType, number>;

const emptyData: JsonLd.Data.BaseData = {
	'@context': {
		'@vocab': 'https://www.w3.org/ns/activitystreams#',
		atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
		schema: 'http://schema.org/',
	},
	'@type': 'Object',
};

const getEmptyJsonLd = (): JsonLd.Data.BaseData => emptyData;

const prioritiseIcon = <T,>({
	fileFormatIcon,
	documentTypeIcon,
	urlIcon,
	providerIcon,
}: IconPriorityOpts<T>): T | undefined =>
	urlIcon || fileFormatIcon || documentTypeIcon || providerIcon;

const extractTaskType = (jsonLd: JsonLd.Data.Task): LinkTaskType | undefined => {
	const taskType = jsonLd['atlassian:taskType'] || (jsonLd as any).taskType;
	if (taskType) {
		if (typeof taskType === 'string') {
			return { id: taskType };
		} else if (taskType['@type'] === 'Link') {
			return { id: taskType.href };
		} else {
			return {
				id: taskType['@id'],
				name: taskType.name,
				icon: taskType.icon && extractUrlFromIconJsonLd(taskType.icon),
			};
		}
	}
};

const extractFileFormat = (jsonLd: JsonLd.Data.Document): string | undefined =>
	jsonLd['schema:fileFormat'];

const documentLabel = (opts: IconOpts, label: string) => {
	if (!opts.showIconLabel) {
		return '';
	}
	return fg('platform_navx_smart_link_icon_label_a11y') ? label : opts.title || label;
};

const getBlogIconWrapped = () => require('./common/ui/icons/blog-icon').default;
const getDocumentIcon = () => require('./common/ui/icons/page-icon').default;
const getFileIcon = () => require('./common/ui/icons/file-icon').default;
const getLiveDocumentIconWrapped = () => require('./common/ui/icons/live-document-icon').default;
const getPresentationIcon = () => require('./common/ui/icons/chart-bar-icon').default;
const getSpreadsheetIcon = () => require('./common/ui/icons/list-bullet-icon').default;

const digitalDocumentToIcon = (opts: IconOpts): React.ReactNode => {
	if (opts.provider?.id && isConfluenceGenerator(opts.provider.id)) {
		const LiveDocumentIconWrapped = getLiveDocumentIconWrapped();
		return (
			<LiveDocumentIconWrapped
				label={documentLabel(opts, 'live document')}
				testId="live-doc-icon"
			/>
		);
	}

	const FileIcon = getFileIcon();
	return <FileIcon label={documentLabel(opts, 'file')} testId="file-icon" />;
};

const documentTypeToIcon = (type: DocumentType, opts: IconOpts): React.ReactNode | undefined => {
	switch (type) {
		case 'schema:BlogPosting': {
			const BlogIconWrapped = getBlogIconWrapped();
			return <BlogIconWrapped label={documentLabel(opts, 'blog')} testId="blog-icon" />;
		}
		case 'schema:DigitalDocument':
			return digitalDocumentToIcon(opts);
		case 'schema:TextDigitalDocument': {
			const DocumentIcon = getDocumentIcon();
			return <DocumentIcon label={documentLabel(opts, 'document')} testId="document-icon" />;
		}
		case 'schema:PresentationDigitalDocument': {
			const PresentationIcon = getPresentationIcon();
			return (
				<PresentationIcon label={documentLabel(opts, 'presentation')} testId="presentation-icon" />
			);
		}
		case 'schema:SpreadsheetDigitalDocument': {
			const SpreadsheetIcon = getSpreadsheetIcon();
			return (
				<SpreadsheetIcon label={documentLabel(opts, 'spreadsheet')} testId="spreadsheet-icon" />
			);
		}
		case 'atlassian:Template':
			return (
				<DocumentFilledIcon
					color="currentColor"
					label={documentLabel(opts, 'template')}
					testId="document-filled-icon"
				/>
			);
		case 'atlassian:UndefinedLink': {
			const DocumentIcon = getDocumentIcon();
			return <DocumentIcon label={documentLabel(opts, 'document')} testId="document-icon" />;
		}
	}
};

const extractIconFromDocument = (
	type: DocumentType,
	opts: IconOpts,
): React.ReactNode | undefined => {
	const iconFromType = documentTypeToIcon(type, opts);
	const iconFromFileFormat = opts.fileFormat
		? getIconForFileType(
				opts.fileFormat,
				fg('platform_navx_smart_link_icon_label_a11y') ? opts.showIconLabel : undefined,
			)
		: undefined;
	const iconFromProvider = opts.provider && opts.provider.icon;

	return prioritiseIcon<React.ReactNode>({
		fileFormatIcon: iconFromFileFormat,
		documentTypeIcon: iconFromType,
		urlIcon: opts.icon,
		providerIcon: iconFromProvider,
	});
};

const extractIconFromTask = (opts: IconOpts): React.ReactNode | undefined => {
	const { taskType, provider } = opts;
	const legacyTaskLabel = opts.title || 'task';
	const getLabel = (semantic: string) =>
		fg('platform_navx_smart_link_icon_label_a11y') ? semantic : legacyTaskLabel;

	const defaultIcon = <TaskObject label={getLabel('Task')} testId="default-task-icon" />;
	if (provider && provider.id === JIRA_GENERATOR_ID && taskType && taskType.id) {
		const taskTypeId = taskType.id;
		const taskTypeName = taskTypeId.split('#').pop();
		switch (taskTypeName) {
			case JIRA_TASK:
				return <TaskObject label={getLabel('Task')} testId="jira-task-icon" />;
			case JIRA_SUB_TASK:
				return <SubtaskObject label={getLabel('Sub-task')} testId="jira-subtask-icon" />;
			case JIRA_STORY:
				return <StoryObject label={getLabel('Story')} testId="jira-story-icon" />;
			case JIRA_BUG:
				return <BugObject label={getLabel('Bug')} testId="jira-bug-icon" />;
			case JIRA_EPIC:
				return <EpicObject label={getLabel('Epic')} testId="jira-epic-icon" />;
			case JIRA_INCIDENT:
				return <IncidentObject label={getLabel('Incident')} testId="jira-incident-icon" />;
			case JIRA_SERVICE_REQUEST:
				return (
					<WorkItemObject label={getLabel('Service request')} testId="jira-service-request-icon" />
				);
			case JIRA_CHANGE:
				return <ChangesObject label={getLabel('Change')} testId="jira-change-icon" />;
			case JIRA_PROBLEM:
				return <ProblemObject label={getLabel('Problem')} testId="jira-problem-icon" />;
			case JIRA_CUSTOM_TASK_TYPE:
				return taskType.icon || opts.icon || provider.icon || defaultIcon;
		}
	}
	return defaultIcon;
};

const typeToIcon = (
	type: JsonLd.Primitives.ObjectType | 'atlassian:Template',
	opts: IconOpts,
): React.ReactNode | undefined => {
	const getLabel = (title: string) =>
		fg('platform_navx_smart_link_icon_label_a11y') ? title : opts.title || title;

	switch (type) {
		case 'atlassian:SourceCodeCommit':
			return <CommitObject label={getLabel('commit')} testId="commit-icon" />;
		case 'atlassian:Project':
			return (
				<PeopleGroupIcon label={getLabel('project')} testId="project-icon" color="currentColor" />
			);
		case 'atlassian:SourceCodePullRequest':
			return <PullRequestObject label={getLabel('pull request')} testId="pull-request-icon" />;
		case 'atlassian:SourceCodeReference':
			return <BranchObject label={getLabel('reference')} testId="branch-icon" />;
		case 'atlassian:SourceCodeRepository':
			return <CodeObject label={getLabel('repository')} testId="repo-icon" />;
		case 'atlassian:Goal':
			return <TaskObject label={getLabel('goal')} testId="task-icon" />;
		case 'atlassian:Task':
			return extractIconFromTask(opts);
		default:
			return undefined;
	}
};

const standardisedExtractIcon = (
	type: JsonLd.Primitives.ObjectType | 'atlassian:Template',
	opts: IconOpts,
) => {
	const iconFromType = typeToIcon(type, opts);
	const iconFromFileFormat = opts.fileFormat
		? getIconForFileType(
				opts.fileFormat,
				fg('platform_navx_smart_link_icon_label_a11y') ? opts.showIconLabel : undefined,
			)
		: undefined;
	const iconFromProvider = opts.provider && opts.provider.icon;

	return prioritiseIcon<React.ReactNode>({
		fileFormatIcon: iconFromFileFormat,
		documentTypeIcon: iconFromType,
		urlIcon: opts.icon,
		providerIcon: iconFromProvider,
	});
};

const extractIconByType = (
	type: JsonLd.Primitives.ObjectType | 'atlassian:Template' | undefined,
	opts: IconOpts,
): React.ReactNode | undefined => {
	switch (type) {
		case 'Document':
		case 'schema:BlogPosting':
		case 'schema:DigitalDocument':
		case 'schema:TextDigitalDocument':
		case 'schema:PresentationDigitalDocument':
		case 'schema:SpreadsheetDigitalDocument':
		case 'atlassian:Template':
		case 'atlassian:UndefinedLink':
			return extractIconFromDocument(type, opts);
		default:
			return type ? standardisedExtractIcon(type, opts) : undefined;
	}
};

const extractIcon = (
	jsonLd: JsonLd.Data.BaseData,
	priority: IconPriority = 'type',
	showIconLabel = true,
): React.ReactNode | undefined => {
	const type = jsonLd['@type'];
	const opts = {
		...(fg('platform_navx_smart_link_icon_label_a11y') ? {} : { title: extractTitle(jsonLd) }),
		provider: extractProvider(jsonLd),
		fileFormat: extractFileFormat(jsonLd as JsonLd.Data.Document),
		taskType: extractTaskType(jsonLd as JsonLd.Data.Task),
		icon: jsonLd.icon && extractUrlFromIconJsonLd(jsonLd.icon),
		priority,
		showIconLabel,
	};
	if (Array.isArray(type)) {
		const highestPriorityType = type.sort(
			(a, b) => extractorPriorityMap[b] - extractorPriorityMap[a],
		)[0];
		return extractIconByType(highestPriorityType, opts);
	} else {
		return extractIconByType(type, opts);
	}
};

const extractInlineIcon = (jsonLd: JsonLd.Data.BaseData, showIconLabel = true) => {
	const provider = extractProvider(jsonLd);
	if (provider && provider.id) {
		if (provider.id === CONFLUENCE_GENERATOR_ID || provider.id === JIRA_GENERATOR_ID) {
			return extractIcon(jsonLd, 'type', showIconLabel);
		}
	}
	return extractIcon(jsonLd, 'provider', showIconLabel);
};

export const extractSmartLinkInlineIcon = (
	response?: SmartLinkResponse,
	showLabel = true,
): SmartLinkInlineIcon | undefined => {
	if (isEntityPresent(response)) {
		if (fg('platform_lp_use_entity_icon_url_for_icon')) {
			const entityIcon = extractEntityIcon(response);
			if (entityIcon) {
				return [entityIcon.url, entityIcon.label];
			}
		}
		const provider = extractEntityProvider(response);
		if (provider) {
			return provider.icon;
		}
	}

	return extractInlineIcon((response?.data as JsonLd.Data.BaseData) || getEmptyJsonLd(), showLabel);
};
