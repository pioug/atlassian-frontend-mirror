import React from 'react';
import { type JsonLd } from 'json-ld-types';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import ProjectIcon from '@atlaskit/icon/glyph/people-group';
import CommitIcon from '@atlaskit/icon-object/glyph/commit/16';
import PullRequestIcon from '@atlaskit/icon-object/glyph/pull-request/16';
import BranchIcon from '@atlaskit/icon-object/glyph/branch/16';
import RepoIcon from '@atlaskit/icon-object/glyph/code/16';
import TaskIcon from '@atlaskit/icon-object/glyph/task/16';

import { extractorPriorityMap } from './priority';
import {
  extractProvider,
  type LinkProvider,
  extractUrlFromIconJsonLd,
  extractTitle,
} from '@atlaskit/link-extractors';
import { extractFileFormat } from './extractFileFormat';
import { extractIconFromDocument } from './extractIconFromDocument';
import { extractIconFromTask } from './extractIconFromTask';
import { extractTaskType, type LinkTaskType } from '../lozenge/extractTaskType';
import { prioritiseIcon } from './prioritiseIcon';

export type IconPriority = 'type' | 'provider';
export interface IconOpts {
  title?: string;
  provider?: LinkProvider;
  fileFormat?: string;
  taskType?: LinkTaskType;
  priority?: IconPriority;
  icon?: string;
}

export const extractIcon = (
  jsonLd: JsonLd.Data.BaseData,
  priority: IconPriority = 'type',
): React.ReactNode | undefined => {
  const type = jsonLd['@type'];
  const opts = {
    title: extractTitle(jsonLd),
    provider: extractProvider(jsonLd),
    fileFormat: extractFileFormat(jsonLd as JsonLd.Data.Document),
    taskType: extractTaskType(jsonLd as JsonLd.Data.Task),
    icon: jsonLd.icon && extractUrlFromIconJsonLd(jsonLd.icon),
    priority,
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
    case 'atlassian:Goal':
      return (
        opts.icon || (
          <TaskIcon label={opts.title || 'goal'} testId="task-icon" />
        )
      );
    case 'atlassian:Project':
      return (
        opts.icon || (
          <ProjectIcon
            label={opts.title || 'project'}
            size="small"
            testId="project-icon"
          />
        )
      );
    case 'atlassian:SourceCodeCommit':
      return <CommitIcon label={opts.title || 'commit'} testId="commit-icon" />;
    case 'atlassian:SourceCodePullRequest':
      return (
        <PullRequestIcon
          label={opts.title || 'pullRequest'}
          testId="pull-request-icon"
        />
      );
    case 'atlassian:SourceCodeReference':
      return (
        <BranchIcon label={opts.title || 'reference'} testId="branch-icon" />
      );
    case 'atlassian:SourceCodeRepository':
      return <RepoIcon label={opts.title || 'repository'} testId="repo-icon" />;
    case 'atlassian:Task':
      return extractIconFromTask(opts);
    default:
      return getBooleanFF('platform.linking-platform.smart-card.standardise-smart-link-icon-behaviour')
        ? extractDefaultIcon(opts)
        : opts.provider && opts.provider.icon;
  }
};

/**
 * Choose which icon to show when the type is not recognized.
 */
const extractDefaultIcon = (opts: IconOpts): React.ReactNode | undefined => {
  const { provider } = opts;
  const providerId = provider?.id;
  return prioritiseIcon<React.ReactNode>({
    providerId,
    fileFormatIcon: undefined,
    documentTypeIcon: undefined,
    urlIcon: opts.icon,
    providerIcon: opts.provider?.icon,
  });
}