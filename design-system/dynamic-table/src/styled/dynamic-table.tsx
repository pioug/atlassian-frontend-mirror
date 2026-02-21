/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, forwardRef, type HTMLProps, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

type TableProps = HTMLProps<HTMLTableElement> & {
	isFixedSize?: boolean;
	isLoading?: boolean;
	hasDataRow: boolean;
	testId?: string;
};

const fixedSizeTableStyles = css({
	tableLayout: 'fixed',
});

const tableStyles = css({
	width: '100%',
	borderCollapse: 'separate',
	borderSpacing: '0px',
	fontFamily: token('font.family.body'),
});

const bodyBorder = css({
	borderBlockEnd: `${token('border.width.selected')} solid ${token('color.border')}`,
});

export const Table: import('react').ForwardRefExoticComponent<
	Omit<TableProps, 'ref'> & import('react').RefAttributes<HTMLTableElement>
> = forwardRef<HTMLTableElement, TableProps>(
	({ isFixedSize, hasDataRow, children, testId, isLoading, ...rest }, ref) => {
		return (
			<table
				// React and Typescript do not yet support the inert attribute https://github.com/facebook/react/pull/24730
				{...{ inert: isLoading ? '' : undefined }}
				style={
					{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						'--local-dynamic-table-hover-bg': token('color.background.neutral.subtle.hovered'),
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						'--local-dynamic-table-highlighted-bg': token('color.background.selected'),
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						'--local-dynamic-table-hover-highlighted-bg': token(
							'color.background.selected.hovered',
						),
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						'--local-dynamic-table-row-focus-outline': token('color.border.focused'),
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
