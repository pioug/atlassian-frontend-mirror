/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { forwardRef, type HTMLProps, version as reactVersion } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

// React 18 doesn't know `inert` and only forwards it as a string attribute (`inert=""`).
// React 19 treats `inert` as a boolean, so `''` is falsy and the attribute is dropped.
const isReact19OrLater = parseInt(reactVersion, 10) >= 19;
const inertValue = isReact19OrLater ? true : '';

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

type TableProps = HTMLProps<HTMLTableElement> & {
	isFixedSize?: boolean;
	isLoading?: boolean;
	hasDataRow: boolean;
	testId?: string;
};

export const Table: import('react').ForwardRefExoticComponent<
	Omit<TableProps, 'ref'> & import('react').RefAttributes<HTMLTableElement>
> = forwardRef<HTMLTableElement, TableProps>(
	({ isFixedSize, hasDataRow, children, testId, isLoading, ...rest }, ref) => {
		return (
			<table
				// Spread so it type-checks against React 18 types, which don't include `inert`
				{...{ inert: isLoading ? inertValue : undefined }}
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
