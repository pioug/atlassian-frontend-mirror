import React from 'react';

import PeopleGroupIcon from '@atlaskit/icon/core/people-group';
import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractProvider,
	extractTitle,
	extractUrlFromIconJsonLd,
	type LinkProvider,
} from '@atlaskit/link-extractors';
import BranchObject from '@atlaskit/object/branch';
import CodeObject from '@atlaskit/object/code';
import CommitObject from '@atlaskit/object/commit';
import PullRequestObject from '@atlaskit/object/pull-request';
import TaskObject from '@atlaskit/object/task';
import { fg } from '@atlaskit/platform-feature-flags';

import { getIconForFileType } from '../../../utils';
import { extractTaskType, type LinkTaskType } from '../lozenge/extractTaskType';

import { extractFileFormat } from './extractFileFormat';
import { extractIconFromDocument } from './extractIconFromDocument';
import { extractIconFromTask } from './extractIconFromTask';
import { prioritiseIcon } from './prioritiseIcon';
import { extractorPriorityMap } from './priority';

export type IconPriority = 'type' | 'provider';
export interface IconOpts {
	fileFormat?: string;
	icon?: string;
	priority?: IconPriority;
	provider?: LinkProvider;
	showIconLabel?: boolean;
	taskType?: LinkTaskType;
	title?: string; // NAVX-4354: remove this during cleanup
}

export const extractIcon = (
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
function typeToIcon(
	type: JsonLd.Primitives.ObjectType | 'atlassian:Template',
	opts: IconOpts,
): React.ReactNode | undefined {
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
}

function standardisedExtractIcon(
	type: JsonLd.Primitives.ObjectType | 'atlassian:Template',
	opts: IconOpts,
) {
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
}

/**
 * Extracts an icon based on the given type.
 *
 * Some types return hardcoded icons, while others follow a priority list on how to pick the icon.
 * If type is not recognized, it will return the icon from the provider, or `undefined` if no icon is found.
 *
 * @param type - The type of the object.
 * @param opts - Options for the icon extraction.
 * @returns The extracted icon as a React node, or `undefined` if no icon is found.
 */
const extractIconByType = (
	type: JsonLd.Primitives.ObjectType | 'atlassian:Template',
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
			return standardisedExtractIcon(type, opts);
	}
};
