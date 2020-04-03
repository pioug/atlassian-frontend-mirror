import React from 'react';
import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';
import { extractPropsFromObject } from './extractPropsFromObject';
import { buildName } from './extractPropsFromSourceCodeCommon';
import CommitIcon from '@atlaskit/icon-object/glyph/commit/16';

export const buildIcon = (json: any) => {
  const name = json.name;
  return { icon: { icon: <CommitIcon label={name} /> } };
};

export const extractPropsFromSourceCodeCommit = (
  json: any,
): BlockCardResolvedViewProps => {
  const props = extractPropsFromObject(json);
  return {
    ...props,
    ...buildIcon(json),
    ...buildName(props, json),
  };
};
