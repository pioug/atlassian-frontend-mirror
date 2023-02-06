/* eslint-disable @repo/internal/react/require-jsdoc */
/** @jsx jsx */
import { FC, forwardRef, HTMLProps } from 'react';

import { css, jsx } from '@emotion/react';

import { gridSize as getGridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { row, tableBorder } from '../theme';

const gridSize = getGridSize();

export type TableProps = HTMLProps<HTMLTableElement> & {
  isFixedSize?: boolean;
  hasDataRow: boolean;
};

// CSS vars for table row
// these are declared here to avoid being re-declared in each table row
export const tableRowCSSVars = {
  CSS_VAR_HOVER_BACKGROUND: '--local-dynamic-table-hover-bg',
  CSS_VAR_HIGHLIGHTED_BACKGROUND: '--local-dynamic-table-highlighted-bg',
  CSS_VAR_HOVER_HIGHLIGHTED_BACKGROUND:
    '--local-dynamic-table-hover-highlighted-bg',
  CSS_VAR_ROW_FOCUS_OUTLINE: '--local-dynamic-table-row-focus-outline',
};

const fixedSizeTableStyles = css({
  tableLayout: 'fixed',
});

const tableStyles = css({
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0px',
});

const bodyBorder = css({
  borderBottom: `2px solid ${tableBorder.borderColor}`,
});

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ isFixedSize, hasDataRow, children, ...rest }, ref) => {
    return (
      <table
        style={
          {
            [tableRowCSSVars.CSS_VAR_HOVER_BACKGROUND]: row.hoverBackground,
            [tableRowCSSVars.CSS_VAR_HIGHLIGHTED_BACKGROUND]:
              row.highlightedBackground,
            [tableRowCSSVars.CSS_VAR_HOVER_HIGHLIGHTED_BACKGROUND]:
              row.hoverHighlightedBackground,
            [tableRowCSSVars.CSS_VAR_ROW_FOCUS_OUTLINE]: row.focusOutline,
          } as React.CSSProperties
        }
        css={[
          tableStyles,
          isFixedSize && fixedSizeTableStyles,
          hasDataRow && bodyBorder,
        ]}
        ref={ref}
        {...rest}
      >
        {children}
      </table>
    );
  },
);

const captionStyles = css({
  marginTop: `${gridSize * 3.5}px`,
  marginBottom: token('space.100', '8px'),
  fontSize: '1.42857143em',
  fontStyle: 'inherit',
  fontWeight: token('font.weight.medium', '500'),
  letterSpacing: '-0.008em',
  lineHeight: 1.2,
  textAlign: 'left',
  /* there is a bug in Safari: if element which creates a new stacking context
    is a child of a table, table caption re-renders in bad wrong position
    https://stackoverflow.com/questions/44009186/safari-bug-translating-table-row-group-using-gsap-make-caption-jump-to-bottom
  */
  willChange: 'transform',
});

export const Caption: FC = ({ children }) => (
  <caption css={captionStyles}>{children}</caption>
);

const paginationWrapperStyles = css({
  display: 'flex',
  justifyContent: 'center',
});

export const PaginationWrapper: FC = ({ children }) => (
  <div css={paginationWrapperStyles}>{children}</div>
);
