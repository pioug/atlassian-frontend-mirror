/** @jsx jsx */
import { jsx } from '@emotion/core';

import { R500 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import { RequiredIndicatorProps } from '../types';

const paddingLeft = `${gridSize() * 0.25}px`;

export default function RequiredIndicator(props: RequiredIndicatorProps) {
  return (
    <span
      css={{
        color: R500,
        paddingLeft,
      }}
      {...props}
    >
      *
    </span>
  );
}
