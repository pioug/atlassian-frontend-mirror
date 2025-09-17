/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, forwardRef, type HTMLProps, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { B100, N300, N30A, N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { ASC, DESC } from '../internal/constants';
import { type SortOrderType } from '../types';

import { getTruncationStyleVars, type TruncateStyleProps } from './constants';

interface HeadProps {
	isRanking?: boolean;
	children: ReactNode;
	testId?: string;
}

const CSS_VAR_TEXT_COLOR = '--local-dynamic-table-text-color';

const rankingStyles = css({ display: 'block' });
const headStyles = css({ borderBlockEnd: `none` });
const overflowTruncateStyles = css({ overflow: 'hidden' });
const truncationWidthStyles = css({ width: `var(--local-dynamic-table-width)` });
const fixedSizeTruncateStyles = css({ textOverflow: 'ellipsis', whiteSpace: 'nowrap' });

const cellStyles = css({
	borderBlock: 'none',
	borderInline: 'none',
	paddingBlockEnd: token('space.050', '4px'),
	paddingBlockStart: token('space.050', '4px'),
	paddingInlineEnd: token('space.100', '8px'),
	paddingInlineStart: token('space.100', '8px'),
	textAlign: 'left',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:first-of-type': {
		paddingInlineStart: token('space.0', '0px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:last-child': {
		paddingInlineEnd: token('space.0', '0px'),
	},
});

export const Head: FC<HeadProps> = ({ isRanking, testId, ...props }) => {
	return (
		<thead
			css={[headStyles, isRanking && rankingStyles]}
			data-testid={testId}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...props}
		/>
	);
};

type HeadCellProps = TruncateStyleProps &
	HTMLProps<HTMLTableCellElement> & {
		onClick?: () => void;
		isSortable?: boolean;
		sortOrder?: SortOrderType;
		testId?: string;
	};

const headCellBaseStyles = css({
	position: 'relative',
	borderBlockEnd: `${token('border.width.selected')} solid ${token('color.border', N40)}`,
	borderBlockStart: `none`,
	color: token('color.text.subtle', `var(${CSS_VAR_TEXT_COLOR})`),
	font: token('font.body.UNSAFE_small'),
	// eslint-disable-next-line @compiled/shorthand-property-sorting
	fontWeight: token('font.weight.bold'),
	textAlign: 'left',
	verticalAlign: 'middle',
	'&:focus-visible': {
		outline: `solid ${token('border.width.focused')} ${token('color.border.focused', B100)}`,
	},
});

const headCellBaseStylesOld = css({
	boxSizing: 'border-box',
	position: 'relative',
	borderBlockEnd: `${token('border.width.selected')} solid ${token('color.border', N40)}`,
	borderBlockStart: 'none',
	borderInlineEnd: 'none',
	borderInlineStart: 'none',
	color: token('color.text.subtle', `var(${CSS_VAR_TEXT_COLOR})`),
	// eslint-disable-next-line @compiled/shorthand-property-sorting
	font: token('font.body.UNSAFE_small'),
	fontWeight: token('font.weight.bold'),
	textAlign: 'left',
	verticalAlign: 'top',
	'&:focus-visible': {
		outline: `solid ${token('border.width.focused')} ${token('color.border.focused', B100)}`,
	},
});

const onClickStyles = css({
	'&:hover': {
		backgroundColor: token('color.background.neutral.hovered', N30A),
		cursor: 'pointer',
	},
});

const baseStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button': {
		position: 'relative',
		appearance: 'none',
		background: 'none',
		border: 'none',
		color: 'inherit',
		cursor: 'inherit',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: 'inherit',
		fontWeight: 'inherit',
		paddingBlockEnd: token('space.0', '0'),
		paddingBlockStart: token('space.0', '0'),
		paddingInlineEnd: token('space.0', '0'),
		paddingInlineStart: token('space.0', '0'),
		'&::before, &::after': {
			display: 'block',
			width: 0,
			height: 0,
			position: 'absolute',
			borderColor: 'transparent',
			borderStyle: 'solid',
			borderWidth: '3px',
			content: '""',
			insetInlineEnd: token('space.negative.100', '-8px'),
		},
		'&::before': {
			borderBlockEnd: `3px solid ${token('color.icon.disabled', N40)}`,
			insetBlockEnd: token('space.100', '8px'),
		},
		'&::after': {
			borderBlockStart: `3px solid ${token('color.icon.disabled', N40)}`,
			insetBlockEnd: 0,
		},
	},
	'@media (forced-colors: active)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > button': {
			'&::before, &::after': {
				borderColor: 'Canvas',
				borderStyle: 'solid',
				borderWidth: '3px',
			},
			'&::before': {
				borderBlockEndColor: 'CanvasText',
				borderBlockEndStyle: 'solid',
				borderBlockEndWidth: '3px',
			},
			'&::after': {
				borderBlockStartColor: 'CanvasText',
				borderBlockStartStyle: 'solid',
				borderBlockStartWidth: '3px',
			},
		},
	},
});

const ascendingStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button': {
		'&::before': {
			borderBlockEnd: `3px solid ${token('color.icon.subtle', N300)}`,
		},
	},
	'@media (forced-colors: active)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > button': {
			'&::before': {
				borderBlockEnd: `3px solid Highlight`,
			},
		},
	},
});

const descendingStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button': {
		'&::after': {
			borderBlockStart: `3px solid ${token('color.icon.subtle', N300)}`,
		},
	},
	'@media (forced-colors: active)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > button': {
			'&::after': {
				borderBlockStart: `3px solid Highlight`,
			},
		},
	},
});

export const HeadCell = forwardRef<HTMLTableCellElement, HeadCellProps>(
	(
		{
			width,
			children,
			isSortable,
			sortOrder,
			isFixedSize,
			shouldTruncate,
			onClick,
			style,
			testId,
			...rest
		},
		ref,
	) => {
		const mergedStyles = {
			...style,
			...(width && getTruncationStyleVars({ width })),
			[CSS_VAR_TEXT_COLOR]: token('color.text.subtlest', N300),
		};
		const isASC = sortOrder === ASC;
		const isDESC = sortOrder === DESC;

		const getFormattedSortOrder = () => {
			if (isASC) {
				return 'ascending';
			} else if (isDESC) {
				return 'descending';
			}
		};

		// If there is no content in the cell, it should be rendered as an empty `td`, not a `th`.
		// https://dequeuniversity.com/rules/axe/4.7/empty-table-header
		const Component = children ? 'th' : 'td';

		const isVisuallyRefreshed = fg('platform-component-visual-refresh');

		return (
			<Component
				aria-sort={getFormattedSortOrder()}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={mergedStyles}
				css={[
					cellStyles,
					isVisuallyRefreshed ? headCellBaseStyles : headCellBaseStylesOld,
					!isVisuallyRefreshed && onClick && onClickStyles,
					truncationWidthStyles,
					isFixedSize && shouldTruncate && fixedSizeTruncateStyles,
					isFixedSize && overflowTruncateStyles,
					!isVisuallyRefreshed && isSortable && baseStyles,
					!isVisuallyRefreshed && isASC && ascendingStyles,
					!isVisuallyRefreshed && isDESC && descendingStyles,
				]}
				onClick={!isVisuallyRefreshed ? onClick : undefined}
				ref={ref}
				data-testid={testId}
				{...rest}
			>
				{children}
			</Component>
		);
	},
);
