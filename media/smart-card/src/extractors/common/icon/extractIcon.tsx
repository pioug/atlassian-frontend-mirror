import React from 'react';
import { JsonLd } from 'json-ld-types';

import ProjectIcon from '@atlaskit/icon/glyph/people-group';
import CommitIcon from '@atlaskit/icon-object/glyph/commit/16';
import PullRequestIcon from '@atlaskit/icon-object/glyph/pull-request/16';
import BranchIcon from '@atlaskit/icon-object/glyph/branch/16';
import RepoIcon from '@atlaskit/icon-object/glyph/code/16';

import { extractorPriorityMap } from './priority';
import { extractProvider, LinkProvider } from '../context/extractProvider';
import { extractTitle } from '../primitives/extractTitle';
import { extractFileFormat } from './extractFileFormat';
import { extractIconFromDocument } from './extractIconFromDocument';
import { extractIconFromTask } from './extractIconFromTask';
import { extractTaskType, LinkTaskType } from '../lozenge/extractTaskType';
import { extractUrlFromIconJsonLd } from '../utils';

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
    case 'atlassian:Project':
      return (
        opts.icon || (
          <ProjectIcon label={opts.title || 'project'} size="small" />
        )
      );
    case 'atlassian:SourceCodeCommit':
      return <CommitIcon label={opts.title || 'commit'} />;
    case 'atlassian:SourceCodePullRequest':
      return <PullRequestIcon label={opts.title || 'pullRequest'} />;
    case 'atlassian:SourceCodeReference':
      return <BranchIcon label={opts.title || 'reference'} />;
    case 'atlassian:SourceCodeRepository':
      return <RepoIcon label={opts.title || 'repository'} />;
    case 'atlassian:Task':
      return extractIconFromTask(opts);
    default:
      return opts.provider && opts.provider.icon;
  }
};
