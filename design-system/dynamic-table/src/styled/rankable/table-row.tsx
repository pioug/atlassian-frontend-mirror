/** @jsx jsx */
import { forwardRef, type HTMLAttributes } from 'react';

import { css, jsx } from '@emotion/react';

import { B100, N20, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type ITableRowProps, TableBodyRow } from '../table-row';

export type RankableTableBodyRowProps = HTMLAttributes<HTMLTableRowElement> &
	ITableRowProps & {
		isRanking?: boolean;
		isRankingItem?: boolean;
		testId?: string;
	};

const rankingStyles = css({
	display: 'block',
});

const rankingItemStyles = css({
	backgroundColor: token('elevation.surface.overlay', N20),
	borderRadius: token('border.radius.050', '2px'),
	boxShadow: token('elevation.shadow.overlay', `0 20px 32px -8px ${N50A}, 0 0 1px ${N60A}`),
});

const draggableStyles = css({
	outlineWidth: token('border.width', '2px'),
	'&:focus-visible': {
		outlineColor: token('color.border.focused', B100),
		outlineStyle: 'solid',
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const RankableTableBodyRow = forwardRef<HTMLTableRowElement, RankableTableBodyRowProps>(
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
