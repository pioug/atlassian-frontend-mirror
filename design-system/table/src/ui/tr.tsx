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
  borderBottom: `1px solid ${token('color.border', '#eee')}`,
  '&:hover': {
    backgroundColor: token(
      'color.background.neutral.subtle.hovered',
      '#f8f8f8',
    ),
  },
  '&:focus-visible::after': {
    boxShadow: 'none',
  },
});

interface TRProps {
  /**
   * A `testId` prop is a unique string that appears as a data attribute `data-testid`
   * in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;
  /**
   * If the row has programatic selection applied.
   */
  isSelected?: boolean;
  /**
   * Adjust the behavior of the element depending on whether the row is in the `THead` or in the `TBody`.
   */
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
