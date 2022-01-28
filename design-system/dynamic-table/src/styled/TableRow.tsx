/** @jsx jsx */
import { CSSProperties, forwardRef, ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { token } from '@atlaskit/tokens';

import { tableRowCSSVars as cssVars } from './DynamicTable';

export type ITableRowProps = {
  isHighlighted?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
};

const rowStyles = css({
  '&:focus': {
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
    'color.background.brand',
    `var(${cssVars.CSS_VAR_HIGHLIGHTED_BACKGROUND})`,
  ),
  '&:hover': {
    backgroundColor: token(
      'color.background.brand.hovered',
      `var(${cssVars.CSS_VAR_HOVER_HIGHLIGHTED_BACKGROUND})`,
    ),
  },
});

export const TableBodyRow = forwardRef<HTMLTableRowElement, ITableRowProps>(
  ({ isHighlighted, children, style, ...rest }, ref) => {
    return (
      <tr
        style={style}
        css={[
          rowStyles,
          isHighlighted ? rowHighlightedBackgroundStyles : rowBackgroundStyles,
        ]}
        {...rest}
        ref={ref}
      >
        {children}
      </tr>
    );
  },
);
