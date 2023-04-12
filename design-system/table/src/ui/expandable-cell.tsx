/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { BaseCell } from './base-cell';

const spacingStyles = css({
  width: 24,
  padding: token('space.0', '0px'),
});

type ExpandableCellProps = {
  as: 'td' | 'th';
  children?: ReactNode;
};

/**
 * __Expandable cell__
 *
 * An expandable cell primitive designed to be used for light weight composition.
 */
export const ExpandableCell = ({ children, as }: ExpandableCellProps) => {
  return (
    <BaseCell as={as} css={spacingStyles}>
      {children}
    </BaseCell>
  );
};
