/** @jsx jsx */
import { jsx } from '@emotion/core';
import { math, gridSize } from '@atlaskit/theme';
import { RequiredIndicatorProps } from '../types';

export default ({ tokens, ...props }: RequiredIndicatorProps) => (
  <span
    css={{
      color: tokens.requiredIndicator.textColor.rest,
      paddingLeft: `${math.multiply(gridSize, 0.25)}px;`,
    }}
    {...props}
  />
);
