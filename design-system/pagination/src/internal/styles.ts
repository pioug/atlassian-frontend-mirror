import { CSSObject } from '@emotion/core';

import { gridSize } from '@atlaskit/theme/constants';

export const ellipsisStyle: CSSObject = {
  display: 'inline-flex',
  textAlign: 'center',
  alignItems: 'center',
  padding: '0 8px',
};

export const navStyle: CSSObject = {
  display: 'flex',
};

const halfGridSize = gridSize() / 2;

export const navigatorStyle: CSSObject = {
  paddingLeft: halfGridSize,
  paddingRight: halfGridSize,
};
