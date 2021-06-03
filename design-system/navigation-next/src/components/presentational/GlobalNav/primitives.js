import React from 'react';

import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

const gridSize = gridSizeFn();

const listBaseStyles = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '100%',
};

export const PrimaryItemsList = (props) => (
  <div css={{ ...listBaseStyles, paddingBottom: gridSize * 2 }} {...props} />
);

export const FirstPrimaryItemWrapper = (props) => (
  <div css={{ paddingBottom: gridSize }} {...props} />
);

export const SecondaryItemsList = (props) => (
  <div
    css={{
      ...listBaseStyles,
      paddingTop: gridSize,
    }}
    {...props}
  />
);
