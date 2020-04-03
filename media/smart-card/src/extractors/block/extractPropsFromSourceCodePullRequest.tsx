import React from 'react';
import { BlockCardResolvedViewProps, LozengeColor } from '@atlaskit/media-ui';
import PullRequestIcon from '@atlaskit/icon-object/glyph/pull-request/16';

import { extractPropsFromObject } from './extractPropsFromObject';
import { buildName } from './extractPropsFromSourceCodeCommon';

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

const buildSourceCodePullRequestTag = (json: any) => {
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

export const buildIcon = (json: any) => {
  const name = json.name;
  return { icon: { icon: <PullRequestIcon label={name} /> } };
};

export const extractPropsFromSourceCodePullRequest = (
  json: any,
): BlockCardResolvedViewProps => {
  const props = extractPropsFromObject(json);
  return {
    ...props,
    ...buildIcon(json),
    ...buildName(props, json),
    ...buildSourceCodePullRequestTag(json),
  };
};
