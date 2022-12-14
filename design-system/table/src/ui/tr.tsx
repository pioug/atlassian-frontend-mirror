/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

import FocusRing from '@atlaskit/focus-ring';
import { token } from '@atlaskit/tokens';

const baseStyles = css({
  height: 48,
  position: 'relative',
  border: 'none',
  borderImageWidth: 0,
  borderSpacing: 0,
});

const selectedStyles = css({
  backgroundColor: token('color.background.selected', '#DEEBFF88'),
  '&:hover': {
    backgroundColor: token('color.background.selected.hovered', '#DEEBFF'), // B50
  },
});

const bodyRowStyles = css({
  '&:hover': {
    backgroundColor: token(
      'color.background.neutral.subtle.hovered',
      '#f8f8f8',
    ),
  },
  '&:focus-visible::after': {
    boxShadow: 'none',
  },
  '&:after': {
    position: 'absolute',
    boxShadow: `inset 0 -1px 0 0 ${token('color.border', '#eee')}`,
    content: "''",
    inset: 0,
    pointerEvents: 'none',
  },
});

interface TRProps {
  testId?: string;
  isSelected?: boolean;
  isBodyRow?: boolean;
}

/**
 * __Row__
 *
 * A row primitive.
 *
 * - [Examples](https://atlassian.design/components/table/examples)
 */
export const TR: FC<TRProps> = ({
  children,
  testId,
  isSelected,
  isBodyRow = true,
}) => {
  return (
    <FocusRing isInset>
      <tr
        tabIndex={-1}
        aria-selected={isSelected}
        data-testid={testId}
        css={[
          baseStyles,
          isBodyRow && bodyRowStyles,
          isSelected && selectedStyles,
        ]}
      >
        {children}
      </tr>
    </FocusRing>
  );
};
