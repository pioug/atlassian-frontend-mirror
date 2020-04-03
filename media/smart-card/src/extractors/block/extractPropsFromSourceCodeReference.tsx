import React from 'react';
import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';
import BranchIcon from '@atlaskit/icon-object/glyph/branch/16';

import { buildName } from './extractPropsFromSourceCodeCommon';
import { extractPropsFromObject } from './extractPropsFromObject';

export const buildIcon = (json: any) => {
  const name = json.name;
  return { icon: { icon: (<BranchIcon label={name} />) as JSX.Element } };
};

export const extractPropsFromSourceCodeReference = (
  json: any,
): BlockCardResolvedViewProps => {
  const props = extractPropsFromObject(json);
  return {
    ...props,
    ...buildIcon(json),
    ...buildName(props, json),
  };
};
