import React from 'react';

import BranchIcon from '@atlaskit/icon-object/glyph/branch/16';
import RepoIcon from '@atlaskit/icon-object/glyph/code/16';
import CommitIcon from '@atlaskit/icon-object/glyph/commit/16';
import PullRequestIcon from '@atlaskit/icon-object/glyph/pull-request/16';
import TaskIcon from '@atlaskit/icon-object/glyph/task/16';
import PeopleGroupIcon from '@atlaskit/icon/core/migration/people-group';
import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractProvider,
	extractTitle,
	extractUrlFromIconJsonLd,
	type LinkProvider,
} from '@atlaskit/link-extractors';

import { getIconForFileType } from '../../../utils';
import { extractTaskType, type LinkTaskType } from '../lozenge/extractTaskType';

import { extractFileFormat } from './extractFileFormat';
import { extractIconFromDocument } from './extractIconFromDocument';
import { extractIconFromTask } from './extractIconFromTask';
import { prioritiseIcon } from './prioritiseIcon';
import { extractorPriorityMap } from './priority';

export type IconPriority = 'type' | 'provider';
export interface IconOpts {
	title?: string;
	provider?: LinkProvider;
	fileFormat?: string;
	taskType?: LinkTaskType;
	priority?: IconPriority;
	icon?: string;
	showIconLabel?: boolean;
}

export const extractIcon = (
	jsonLd: JsonLd.Data.BaseData,
	priority: IconPriority = 'type',
	showIconLabel = true,
): React.ReactNode | undefined => {
	const type = jsonLd['@type'];
	const opts = {
		title: extractTitle(jsonLd),
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
	switch (type) {
		case 'atlassian:SourceCodeCommit':
			return <CommitIcon label={opts.title || 'commit'} testId="commit-icon" />;
		case 'atlassian:Project':
			return (
				<PeopleGroupIcon
					label={opts.title || 'project'}
					LEGACY_size="small"
					testId="project-icon"
					color="currentColor"
				/>
			);
		case 'atlassian:SourceCodePullRequest':
			return <PullRequestIcon label={opts.title || 'pullRequest'} testId="pull-request-icon" />;
		case 'atlassian:SourceCodeReference':
			return <BranchIcon label={opts.title || 'reference'} testId="branch-icon" />;
		case 'atlassian:SourceCodeRepository':
			return <RepoIcon label={opts.title || 'repository'} testId="repo-icon" />;
		case 'atlassian:Goal':
			return <TaskIcon label={opts.title || 'goal'} testId="task-icon" />;
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
	const iconFromFileFormat = opts.fileFormat ? getIconForFileType(opts.fileFormat) : undefined;
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
