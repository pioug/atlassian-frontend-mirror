/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, forwardRef, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

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
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			'var(--local-dynamic-table-hover-bg)',
		)}`,
		outlineOffset: `-2px`,
	},
});

const rowBackgroundStyles = css({
	'&:hover': {
		backgroundColor: token(
			'color.background.neutral.subtle.hovered',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			'var(--local-dynamic-table-hover-bg)',
		),
	},
});
const rowHighlightedBackgroundStyles = css({
	backgroundColor: token(
		'color.background.selected',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		'var(--local-dynamic-table-highlighted-bg)',
	),
	'&:hover': {
		backgroundColor: token(
			'color.background.selected.hovered',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			'var(--local-dynamic-table-hover-highlighted-bg)',
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
				css={[rowStyles, isHighlighted ? rowHighlightedBackgroundStyles : rowBackgroundStyles]}
				{...rest}
				ref={ref}
				data-testid={testId}
			>
				{children}
			</tr>
		);
	},
);
