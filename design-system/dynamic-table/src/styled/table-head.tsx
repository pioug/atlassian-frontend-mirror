/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, forwardRef, type HTMLProps, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

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
	paddingBlockEnd: token('space.050'),
	paddingBlockStart: token('space.050'),
	paddingInlineEnd: token('space.100'),
	paddingInlineStart: token('space.100'),
	textAlign: 'left',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:first-of-type': {
		paddingInlineStart: token('space.0'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:last-child': {
		paddingInlineEnd: token('space.0'),
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
	borderBlockEnd: `${token('border.width.selected')} solid ${token('color.border')}`,
	borderBlockStart: `none`,
	color: token('color.text.subtle', `var(${CSS_VAR_TEXT_COLOR})`),
	font: token('font.body.small'),
	// eslint-disable-next-line @compiled/shorthand-property-sorting
	fontWeight: token('font.weight.bold'),
	textAlign: 'left',
	verticalAlign: 'middle',
	'&:focus-visible': {
		outline: `solid ${token('border.width.focused')} ${token('color.border.focused')}`,
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
			[CSS_VAR_TEXT_COLOR]: token('color.text.subtlest'),
		};
		const isASC = sortOrder === ASC;
		const isDESC = sortOrder === DESC;

		const getFormattedSortOrder = () => {
			if (isASC) {
				return 'ascending';
			} else if (isDESC) {
				return 'descending';
			}

			return;
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
					cellStyles,
					headCellBaseStyles,
					truncationWidthStyles,
					isFixedSize && shouldTruncate && fixedSizeTruncateStyles,
					isFixedSize && overflowTruncateStyles,
				]}
				onClick={undefined}
				ref={ref}
				data-testid={testId}
				{...rest}
			>
				{children}
			</Component>
		);
	},
);
