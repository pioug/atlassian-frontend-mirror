/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { BaseCell } from './base-cell';

const spacingStyles = css({
  width: 32,
  padding: token('space.0', '0px'),
});

type SelectableCellProps = {
  as: 'td' | 'th';
  children?: ReactNode;
};

/**
 * __Selectable cell__
 *
 * A selectable cell primitive designed to be used for light weight composition.
 */
export const SelectableCell = ({ children, as }: SelectableCellProps) => {
  return (
    <BaseCell as={as} css={spacingStyles}>
      {children}
    </BaseCell>
  );
};
