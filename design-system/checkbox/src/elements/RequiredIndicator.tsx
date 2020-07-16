/** @jsx jsx */
import { jsx } from '@emotion/core';

import { gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';

import { RequiredIndicatorProps } from '../types';

export default ({ tokens, ...props }: RequiredIndicatorProps) => (
  <span
    css={{
      color: tokens.requiredIndicator.textColor.rest,
      paddingLeft: `${multiply(gridSize, 0.25)}px;`,
    }}
    {...props}
  />
);
