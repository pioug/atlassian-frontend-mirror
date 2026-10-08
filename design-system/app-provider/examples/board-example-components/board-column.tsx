/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import Image from '@atlaskit/image/image';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import columnDoneIcon from '../assets/column-icons/column-done.svg';
import columnInProgressIcon from '../assets/column-icons/column-in-progress.svg';
import columnInReviewIcon from '../assets/column-icons/column-in-review.svg';
import columnTodoIcon from '../assets/column-icons/column-todo.svg';
import { Badge } from './badge';
import { BoardCardComponent } from './board-card';
import type { BoardColumnData } from './types';

const columnStyles = cssMap({
	column: {
		flex: 1,
		minWidth: '280px',
		borderStartStartRadius: token('radius.large'),
		borderStartEndRadius: token('radius.large'),
		paddingBlockStart: token('space.150'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.0'),
		paddingInlineStart: token('space.100'),
		display: 'flex',
		flexDirection: 'column',
		border: `${token('border.width')} solid ${token('color.border')}`,
	},
	columnHeader: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.075'),
		paddingInline: token('space.100'),
		flexShrink: 0,
	},
	columnCards: {
		flex: 1,
		overflowY: 'auto',
		display: 'flex',
		flexDirection: 'column',
		paddingBlockStart: token('space.150'),
	},
	columnIcon: {
		width: '16px',
		height: '16px',
		display: 'flex',
		flexShrink: 0,
	},
	columnWithoutGradient: {
		backgroundColor: token('elevation.surface.sunken'),
	},
});

/**
 * Helper function to get column icon based on color
 */
const COLUMN_ICONS: Record<string, string> = {
	'#357DE8': columnTodoIcon, // To do - blue
	'#FCA700': columnInProgressIcon, // In progress - orange
	'#AF59E1': columnInReviewIcon, // In review - purple
	'#6A9A23': columnDoneIcon, // Done - green
};

const getColumnIcon = (color: string): string => {
	return COLUMN_ICONS[color] ?? columnTodoIcon;
};

export interface BoardColumnProps {
	column: BoardColumnData;
	shouldEnableGradient?: boolean;
}

export const BoardColumn = ({
	column,
	shouldEnableGradient = true,
}: BoardColumnProps): JSX.Element => (
	<Box
		xcss={cx(columnStyles.column, !shouldEnableGradient && columnStyles.columnWithoutGradient)}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		style={
			shouldEnableGradient
				? {
						background:
							'linear-gradient(to bottom, var(--ds-surface-sunken, #f7f7f8), var(--ds-surface-sunken, #f7f7f8) 5%, rgba(from var(--ds-surface-sunken, #f7f7f8) r g b / 0.24) 20%)',
					}
				: undefined
		}
	>
		<Box xcss={columnStyles.columnHeader}>
			<Box xcss={columnStyles.columnIcon}>
				<Image src={getColumnIcon(column.color)} alt="" />
			</Box>
			<Text weight="medium" size="medium">
				{column.title}
			</Text>
			<Badge variant="metric">{column.count}</Badge>
		</Box>
		<Box xcss={columnStyles.columnCards}>
			<Stack space="space.150">
				{column.cards.map((card) => (
					<BoardCardComponent key={card.id} card={card} />
				))}
			</Stack>
		</Box>
	</Box>
);
