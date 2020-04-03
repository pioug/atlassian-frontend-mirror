import React from 'react';
import { InlineCardResolvedViewProps } from '@atlaskit/media-ui';
import { extractInlineViewPropsFromObject } from './extractPropsFromObject';
import { buildName } from './extractPropsFromSourceCodeCommon';
import { BuildInlineProps } from './types';
import CommitIcon from '@atlaskit/icon-object/glyph/commit/16';

type BuildInlinePropsSourceCodeCommit = BuildInlineProps<
  InlineCardResolvedViewProps
>;

export const buildIcon: BuildInlinePropsSourceCodeCommit = json => {
  const name = json.name;
  return { icon: <CommitIcon label={name} /> };
};

export const extractInlineViewPropsFromSourceCodeCommit = (
  json: any,
): InlineCardResolvedViewProps => {
  const props = extractInlineViewPropsFromObject(json);
  return {
    ...props,
    ...buildIcon(json),
    ...buildName(props, json),
  };
};
