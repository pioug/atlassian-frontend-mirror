/** @jsx jsx */
import { jsx } from '@emotion/core';
import { fontSize } from '@atlaskit/theme/constants';

import { gs } from '../utils';

export interface NameProps {
  name: React.ReactNode;
  isLeftPadded?: boolean;
  testId?: string;
  children?: React.ReactNode;
}

export const Name = ({ name, isLeftPadded = true, testId }: NameProps) => (
  <span
    css={{
      fontSize: `${fontSize()}px`,
      fontWeight: 500,
      marginLeft: isLeftPadded ? gs(1) : '0',
      lineHeight: gs(2.5),
      // Spec: show max two lines.
      display: '-webkit-box',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      wordBreak: 'break-word',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      // Fallback options.
      maxHeight: gs(6),
    }}
    data-testid={testId}
  >
    {name}
  </span>
);
