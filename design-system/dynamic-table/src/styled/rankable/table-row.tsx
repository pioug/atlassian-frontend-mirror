/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type HTMLAttributes } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { type ITableRowProps, TableBodyRow } from '../table-row';

type RankableTableBodyRowProps = HTMLAttributes<HTMLTableRowElement> &
	ITableRowProps & {
		isRanking?: boolean;
		isRankingItem?: boolean;
		testId?: string;
	};

const rankingStyles = css({
	display: 'block',
});

const rankingItemStyles = css({
	backgroundColor: token('elevation.surface.overlay'),
	borderRadius: token('radius.xsmall'),
	boxShadow: token('elevation.shadow.overlay'),
});

const draggableStyles = css({
	outlineWidth: token('border.width'),
	'&:focus-visible': {
		outlineColor: token('color.border.focused'),
		outlineStyle: 'solid',
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const RankableTableBodyRow: import('react').ForwardRefExoticComponent<
	HTMLAttributes<HTMLTableRowElement> &
		ITableRowProps & {
			isRanking?: boolean;
			isRankingItem?: boolean;
			testId?: string;
		} & import('react').RefAttributes<HTMLTableRowElement>
> = forwardRef<HTMLTableRowElement, RankableTableBodyRowProps>(
	({ isRanking, isRankingItem, testId, ...props }, ref) => {
		return (
			<TableBodyRow
				css={[isRanking && rankingStyles, isRankingItem && rankingItemStyles, draggableStyles]}
				ref={ref}
				testId={testId}
				{...props}
			/>
		);
	},
);
