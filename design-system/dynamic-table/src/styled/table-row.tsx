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
		outline: `${token('border.width.focused')} solid ${token('color.border.focused', 'var(--local-dynamic-table-hover-bg)')}`,
		outlineOffset: `-2px`,
	},
});

const rowBackgroundStyles = css({
	'&:hover': {
		backgroundColor: token(
			'color.background.neutral.subtle.hovered',
			'var(--local-dynamic-table-hover-bg)',
		),
	},
});
const rowHighlightedBackgroundStyles = css({
	backgroundColor: token('color.background.selected', 'var(--local-dynamic-table-highlighted-bg)'),
	'&:hover': {
		backgroundColor: token(
			'color.background.selected.hovered',
			'var(--local-dynamic-table-hover-highlighted-bg)',
		),
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const TableBodyRow: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ITableRowProps> & React.RefAttributes<HTMLTableRowElement>
> = forwardRef<HTMLTableRowElement, ITableRowProps>(
	({ isHighlighted, children, style, testId, className, ...rest }, ref) => {
		return (
			<tr
				style={style}
				css={[rowStyles, isHighlighted ? rowHighlightedBackgroundStyles : rowBackgroundStyles]}
				/**
				 * We rely on this `className` for the `RankableTableBodyRow` to apply extra styles.
				 * With Compiled it needs to be statically analyzable. It does not get applied via spread props.
				 */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={className}
				{...rest}
				ref={ref}
				data-testid={testId}
			>
				{children}
			</tr>
		);
	},
);
