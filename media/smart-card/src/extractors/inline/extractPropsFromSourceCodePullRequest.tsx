import React from 'react';
import { InlineCardResolvedViewProps, LozengeColor } from '@atlaskit/media-ui';
import PullRequestIcon from '@atlaskit/icon-object/glyph/pull-request/16';

import { extractInlineViewPropsFromObject } from './extractPropsFromObject';
import { buildName } from './extractPropsFromSourceCodeCommon';
import { BuildInlineProps } from './types';

type BuildInlinePropsSourceCodePullRequest = BuildInlineProps<
  InlineCardResolvedViewProps
>;

export type PullRequestState = 'open' | 'merged' | 'declined' | 'closed';
export const pullRequestStateToLozengeMap: Record<
  PullRequestState,
  LozengeColor
> = {
  open: 'inprogress',
  merged: 'success',
  declined: 'removed',
  closed: 'success',
};

const buildInlineSourceCodePullRequestTag: BuildInlinePropsSourceCodePullRequest = json => {
  if (json['atlassian:state']) {
    const state: PullRequestState = json['atlassian:state'].toLowerCase();
    return {
      lozenge: {
        appearance: pullRequestStateToLozengeMap[state] || 'default',
        text: state,
      },
    };
  }
  return {};
};

export const buildIcon: BuildInlinePropsSourceCodePullRequest = json => {
  const name = json.name;
  return { icon: <PullRequestIcon label={name} /> };
};

export const extractInlineViewPropsFromSourceCodePullRequest = (
  json: any,
): InlineCardResolvedViewProps => {
  const props = extractInlineViewPropsFromObject(json);
  return {
    ...props,
    ...buildIcon(json),
    ...buildName(props, json),
    ...buildInlineSourceCodePullRequestTag(json),
  };
};
