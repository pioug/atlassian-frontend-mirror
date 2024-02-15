/* eslint-disable @repo/internal/react/require-jsdoc */
/** @jsx jsx */
import { FC, forwardRef, HTMLProps, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize as getGridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { row, tableBorder } from '../theme';

const gridSize = getGridSize();

export type TableProps = HTMLProps<HTMLTableElement> & {
  isFixedSize?: boolean;
  isLoading?: boolean;
  hasDataRow: boolean;
  testId?: string;
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
  borderBlockEnd: `2px solid ${tableBorder.borderColor}`,
});

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ isFixedSize, hasDataRow, children, testId, isLoading, ...rest }, ref) => {
    return (
      <table
        // React and Typescript do not yet support the inert attribute https://github.com/facebook/react/pull/24730
        {...{ inert: isLoading ? '' : undefined }}
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
        data-testid={testId && `${testId}--table`}
      >
        {children}
      </table>
    );
  },
);

const captionStyles = css({
  fontSize: '1.42857143em',
  fontStyle: 'inherit',
  fontWeight: 'var(--ds-font-weight-medium)',
  letterSpacing: '-0.008em',
  lineHeight: 1.2,
  marginBlockEnd: token('space.100', '8px'),
  marginBlockStart: `${gridSize * 3.5}px`,
  textAlign: 'left',
  willChange: 'transform',
});

export const Caption: FC<{ children: ReactNode }> = ({ children }) => (
  <caption css={captionStyles}>{children}</caption>
);

const paginationWrapperStyles = css({
  display: 'flex',
  justifyContent: 'center',
});

export const PaginationWrapper: FC<{
  children: ReactNode;
  testId?: string;
}> = ({ children, testId }) => (
  <div
    css={paginationWrapperStyles}
    data-testid={testId && `${testId}--pagination--container`}
  >
    {children}
  </div>
);
