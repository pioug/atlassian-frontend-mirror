/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/core';

import { gridSize } from '@atlaskit/theme/constants';

const fixedHeightStyles = css({
  height: `${gridSize() * 18}px`,
});

export const EmptyViewWithFixedHeight: FC = ({ children }) => (
  <div css={fixedHeightStyles}>{children}</div>
);

const emptyViewContainerStyles = css({
  margin: 'auto',
  padding: '10px',
  textAlign: 'center',
  width: '50%',
});

export const EmptyViewContainer: FC = ({ children }) => (
  <div css={emptyViewContainerStyles}>{children}</div>
);
