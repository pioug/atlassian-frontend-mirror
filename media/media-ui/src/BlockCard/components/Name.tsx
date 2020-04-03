/** @jsx jsx */
import { jsx } from '@emotion/core';
import { fontSize } from '@atlaskit/theme/constants';

import { gs } from '../utils';

export interface NameProps {
  name: string;
  isLeftPadded?: boolean;
  testId?: string;
}

export const Name = ({ name, isLeftPadded = true, testId }: NameProps) => (
  <p
    css={{
      margin: 0,
      fontSize: `${fontSize()}px`,
      fontWeight: 500,
      marginLeft: isLeftPadded ? gs(1) : '0px',
    }}
    data-testid={testId}
  >
    {name}
  </p>
);
