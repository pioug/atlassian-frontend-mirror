/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/core';

import { gridSize as getGridSize } from '@atlaskit/theme/constants';

import type { Width } from '../index';

const gridSize = getGridSize();

const verticalMarginSize = gridSize * 6;

const columnWidth = gridSize * 8;
const gutter = gridSize * 2;

const containerStyles = css({
  margin: `${verticalMarginSize}px auto`,
  textAlign: 'center',
});

/* Use max-width so the component can shrink on smaller viewports. */
const wideContainerStyles = css({
  maxWidth: `${columnWidth * 6 + gutter * 5}px`,
});

const narrowContainerStyles = css({
  maxWidth: `${columnWidth * 4 + gutter * 3}px`,
});

/**
 * __Container__
 *
 * Upper level container for Empty State.
 *
 * @internal
 */
const Container: FC<{ testId?: string; width: Width }> = ({
  children,
  width,
  testId,
}) => (
  <div
    data-testid={testId}
    css={[
      containerStyles,
      width === 'narrow' ? narrowContainerStyles : wideContainerStyles,
    ]}
  >
    {children}
  </div>
);

export default Container;
