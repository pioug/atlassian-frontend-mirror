/** @jsx jsx */
import { type CSSProperties, forwardRef, type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { tableRowCSSVars as cssVars } from './dynamic-table';

export type ITableRowProps = {
  isHighlighted?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
  testId?: string;
};

const rowStyles = css({
  backgroundColor: token('color.background.neutral.subtle', 'transparent'),
  '&:focus-visible': {
    outline: `2px solid ${token(
      'color.border.focused',
      `var(${cssVars.CSS_VAR_HOVER_BACKGROUND})`,
    )}`,
    outlineOffset: `-2px`,
  },
});

const rowBackgroundStyles = css({
  '&:hover': {
    backgroundColor: token(
      'color.background.neutral.subtle.hovered',
      `var(${cssVars.CSS_VAR_HOVER_BACKGROUND})`,
    ),
  },
});
const rowHighlightedBackgroundStyles = css({
  backgroundColor: token(
    'color.background.selected',
    `var(${cssVars.CSS_VAR_HIGHLIGHTED_BACKGROUND})`,
  ),
  '&:hover': {
    backgroundColor: token(
      'color.background.selected.hovered',
      `var(${cssVars.CSS_VAR_HOVER_HIGHLIGHTED_BACKGROUND})`,
    ),
  },
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const TableBodyRow = forwardRef<HTMLTableRowElement, ITableRowProps>(
  ({ isHighlighted, children, style, testId, ...rest }, ref) => {
    return (
      <tr
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        style={style}
        css={[
          rowStyles,
          isHighlighted ? rowHighlightedBackgroundStyles : rowBackgroundStyles,
        ]}
        {...rest}
        ref={ref}
        data-testid={testId}
      >
        {children}
      </tr>
    );
  },
);
