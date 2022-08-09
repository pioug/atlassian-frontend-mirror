/* eslint-disable @repo/internal/react/require-jsdoc */
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
  width: '50%',
  margin: 'auto',
  padding: '10px',
  textAlign: 'center',
});

export const EmptyViewContainer: FC = ({ children }) => (
  <div css={emptyViewContainerStyles}>{children}</div>
);
