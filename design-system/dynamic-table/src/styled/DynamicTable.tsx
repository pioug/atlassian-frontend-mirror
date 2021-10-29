/** @jsx jsx */
import { FC, forwardRef, HTMLProps } from 'react';

import { css, jsx } from '@emotion/core';

import { useGlobalTheme } from '@atlaskit/theme/components';
import { gridSize as getGridSize } from '@atlaskit/theme/constants';

import { row } from '../theme';

const gridSize = getGridSize();

export type TableProps = HTMLProps<HTMLTableElement> & {
  isFixedSize?: boolean;
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
  borderCollapse: 'collapse',
  width: '100%',
});

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ isFixedSize, children, ...rest }, ref) => {
    const theme = useGlobalTheme();
    return (
      <table
        style={
          {
            [tableRowCSSVars.CSS_VAR_HOVER_BACKGROUND]: row.hoverBackground({
              theme,
            }),
            [tableRowCSSVars.CSS_VAR_HIGHLIGHTED_BACKGROUND]: row.highlightedBackground(
              {
                theme,
              },
            ),
            [tableRowCSSVars.CSS_VAR_HOVER_HIGHLIGHTED_BACKGROUND]: row.hoverHighlightedBackground(
              { theme },
            ),
            [tableRowCSSVars.CSS_VAR_ROW_FOCUS_OUTLINE]: row.focusOutline({
              theme,
            }),
          } as React.CSSProperties
        }
        css={[tableStyles, isFixedSize && fixedSizeTableStyles]}
        ref={ref}
        {...rest}
      >
        {children}
      </table>
    );
  },
);

const captionStyles = css({
  fontSize: '1.42857143em',
  /* there is a bug in Safari: if element which creates a new stacking context
     is a child of a table, table caption re-renders in bad wrong position
     https://stackoverflow.com/questions/44009186/safari-bug-translating-table-row-group-using-gsap-make-caption-jump-to-bottom
  */
  willChange: 'transform',
  fontStyle: 'inherit',
  fontWeight: 500,
  letterSpacing: '-0.008em',
  lineHeight: 1.2,
  marginBottom: `${gridSize}px`,
  marginTop: `${gridSize * 3.5}px`,
  textAlign: 'left',
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
