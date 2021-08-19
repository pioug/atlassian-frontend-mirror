/** @jsx jsx */
import { jsx } from '@emotion/core';

import { R500 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { RequiredIndicatorProps } from '../types';

const paddingLeft = `${gridSize() * 0.25}px`;

export default function RequiredIndicator(props: RequiredIndicatorProps) {
  return (
    <span
      css={{
        color: token('color.text.danger', R500),
        paddingLeft,
      }}
      {...props}
    >
      *
    </span>
  );
}
