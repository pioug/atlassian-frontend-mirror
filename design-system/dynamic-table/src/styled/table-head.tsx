/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, forwardRef, type HTMLProps, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { B100, N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { ASC, DESC } from '../internal/constants';
import { arrow, head, MSThemeColors, tableBorder } from '../theme';
import { type SortOrderType } from '../types';

import {
	cellStyles,
	fixedSizeTruncateStyles,
	getTruncationStyleVars,
	overflowTruncateStyles,
	type TruncateStyleProps,
	truncationWidthStyles,
} from './constants';

interface HeadProps {
	isRanking?: boolean;
	children: ReactNode;
	testId?: string;
}

const CSS_VAR_TEXT_COLOR = '--local-dynamic-table-text-color';

const rankingStyles = css({
	display: 'block',
});

const headStyles = css({
	borderBlockEnd: `none`,
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
	boxSizing: 'border-box',
	position: 'relative',
	border: 'none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderBlockEnd: `2px solid ${tableBorder.borderColor}`,
	color: token('color.text.subtlest', `var(${CSS_VAR_TEXT_COLOR})`),
	font: token('font.heading.xxsmall'),
	textAlign: 'left',
	verticalAlign: 'top',
	'&:focus-visible': {
		outline: `solid 2px ${token('color.border.focused', B100)}`,
	},
});

const headCellBaseStylesModernized = css({
	boxSizing: 'border-box',
	position: 'relative',
	border: 'none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderBlockEnd: `2px solid ${tableBorder.borderColor}`,
	color: token('color.text.subtle', `var(${CSS_VAR_TEXT_COLOR})`),
	font: token('font.body.UNSAFE_small'),
	fontWeight: token('font.weight.bold'),
	textAlign: 'left',
	verticalAlign: 'top',
	'&:focus-visible': {
		outline: `solid 2px ${token('color.border.focused', B100)}`,
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
		padding: token('space.0', '0'),
		position: 'relative',
		appearance: 'none',
		background: 'none',
		border: 'none',
		color: 'inherit',
		cursor: 'inherit',
		fontSize: 'inherit',
		fontWeight: 'inherit',
		'&::before, &::after': {
			display: 'block',
			width: 0,
			height: 0,
			position: 'absolute',
			border: '3px solid transparent',
			content: '""',
			insetInlineEnd: token('space.negative.100', '-8px'),
		},
		'&::before': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			borderBlockEnd: `3px solid ${arrow.defaultColor}`,
			insetBlockEnd: token('space.100', '8px'),
		},
		'&::after': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			borderBlockStart: `3px solid ${arrow.defaultColor}`,
			insetBlockEnd: 0,
		},
	},
	'@media (forced-colors: active)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > button': {
			'&::before, &::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				border: `3px solid ${MSThemeColors.Background}`,
			},
			'&::before': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				borderBlockEnd: `3px solid ${MSThemeColors.Text}`,
			},
			'&::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				borderBlockStart: `3px solid ${MSThemeColors.Text}`,
			},
		},
	},
});

const ascendingStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button': {
		'&::before': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			borderBlockEnd: `3px solid ${arrow.selectedColor}`,
		},
	},
	'@media (forced-colors: active)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > button': {
			'&::before': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				borderBlockEnd: `3px solid ${MSThemeColors.SelectedBackground}`,
			},
		},
	},
});

const descendingStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button': {
		'&::after': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			borderBlockStart: `3px solid ${arrow.selectedColor}`,
		},
	},
	'@media (forced-colors: active)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > button': {
			'&::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				borderBlockStart: `3px solid ${MSThemeColors.SelectedBackground}`,
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
			[CSS_VAR_TEXT_COLOR]: head.textColor,
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

		return (
			<Component
				aria-sort={getFormattedSortOrder()}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={mergedStyles}
				css={[
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					cellStyles,
					fg('design_system_team_dynamic_table_typography')
						? headCellBaseStylesModernized
						: headCellBaseStyles,
					onClick && onClickStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					truncationWidthStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					isFixedSize && shouldTruncate && fixedSizeTruncateStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					isFixedSize && overflowTruncateStyles,
					isSortable && baseStyles,
					isASC && ascendingStyles,
					isDESC && descendingStyles,
				]}
				onClick={onClick}
				ref={ref}
				data-testid={testId}
				{...rest}
			>
				{children}
			</Component>
		);
	},
);
