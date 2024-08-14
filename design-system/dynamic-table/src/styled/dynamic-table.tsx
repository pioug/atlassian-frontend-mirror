/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, forwardRef, type HTMLProps, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { row, tableBorder } from '../theme';

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
	CSS_VAR_HOVER_HIGHLIGHTED_BACKGROUND: '--local-dynamic-table-hover-highlighted-bg',
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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderBlockEnd: `2px solid ${tableBorder.borderColor}`,
});

export const Table = forwardRef<HTMLTableElement, TableProps>(
	({ isFixedSize, hasDataRow, children, testId, isLoading, ...rest }, ref) => {
		return (
			<table
				// React and Typescript do not yet support the inert attribute https://github.com/facebook/react/pull/24730
				{...{ inert: isLoading ? '' : undefined }}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={
					{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						[tableRowCSSVars.CSS_VAR_HOVER_BACKGROUND]: row.hoverBackground,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						[tableRowCSSVars.CSS_VAR_HIGHLIGHTED_BACKGROUND]: row.highlightedBackground,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						[tableRowCSSVars.CSS_VAR_HOVER_HIGHLIGHTED_BACKGROUND]: row.hoverHighlightedBackground,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						[tableRowCSSVars.CSS_VAR_ROW_FOCUS_OUTLINE]: row.focusOutline,
					} as React.CSSProperties
				}
				css={[tableStyles, isFixedSize && fixedSizeTableStyles, hasDataRow && bodyBorder]}
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
	font: token('font.heading.medium'),
	marginBlockEnd: token('space.100', '8px'),
	marginBlockStart: token('space.300'),
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
	<div css={paginationWrapperStyles} data-testid={testId && `${testId}--pagination--container`}>
		{children}
	</div>
);
