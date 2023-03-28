/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { BaseCell } from './base-cell';

const spacingStyles = css({
  width: 32,
  padding: token('space.0', '0px'),
  paddingLeft: token('space.100', '8px'),
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& + *': {
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
    paddingLeft: '8px !important',
  },
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
export const SelectableCell: FC<SelectableCellProps> = ({
  children,
  as = 'td',
}) => {
  return (
    <BaseCell as={as} css={spacingStyles}>
      {children}
    </BaseCell>
  );
};
