/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { easeInOut } from '@atlaskit/motion/curves';
import { durations } from '@atlaskit/motion/durations';
import { token } from '@atlaskit/tokens';

import type { ColumnType } from '../../examples/data/tasks';

import { Card } from './board-card';
import type { RbdApi } from './types';

const columnStyles = css({
	display: 'flex',
	width: 250,
	flexDirection: 'column',
	background: token('elevation.surface.sunken', '#F7F8F9'),
	borderRadius: 16,
	position: 'relative',
	overflow: 'hidden',
	marginRight: token('space.200', '16px'),
});

const columnDraggingStyles = css({
	boxShadow: token(
		'elevation.shadow.overlay',
		'0px 8px 12px rgba(9, 30, 66, 0.15),0px 0px 1px rgba(9, 30, 66, 0.31)',
	),
});

const scrollContainerStyles = css({
	height: '100%',
	overflowY: 'auto',
});

const cardListStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	minHeight: '100%',
	padding: token('space.100', '8px'),
	flexDirection: 'column',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	transition: `background ${durations.medium}ms ${easeInOut}`,
});

const columnHeaderStyles = css({
	display: 'flex',
	padding: `${token('space.200', '16px')} ${token('space.200', '16px')} ${token(
		'space.100',
		'8px',
	)}`,
	justifyContent: 'space-between',
	flexDirection: 'row',
	color: token('color.text.subtlest', '#626F86'),
	userSelect: 'none',
});

const columnHeaderIdStyles = css({
	color: token('color.text.disabled', '#091E424F'),
	fontSize: '10px',
});

const isDraggingOverColumnStyles = css({
	background: token('color.background.selected.hovered', '#CCE0FF'),
});

type ColumnProps = {
	column: ColumnType;
	droppableId: string;
	index: number;
	rbdApi: RbdApi;
};

export const Column = memo(({ column, droppableId, index, rbdApi }: ColumnProps) => {
	const { Draggable, Droppable } = rbdApi;

	const columnId = column.columnId;

	return (
		<Draggable draggableId={`draggable-${column.columnId}`} index={index}>
			{(provided, snapshot) => {
				return (
					<div
						data-testid={`column-${columnId}`}
						css={[columnStyles, snapshot.isDragging && columnDraggingStyles]}
						ref={provided.innerRef}
						{...provided.draggableProps}
					>
						<div
							css={columnHeaderStyles}
							data-testid={`column-${columnId}--header`}
							{...provided.dragHandleProps}
						>
							<h6>{column.title}</h6>
							<span css={columnHeaderIdStyles}>ID: {column.columnId}</span>
						</div>
						<Droppable droppableId={droppableId} type="card">
							{(provided, snapshot) => {
								return (
									<div
										css={scrollContainerStyles}
										ref={provided.innerRef}
										{...provided.droppableProps}
									>
										<div
											data-testid={`column-${columnId}--item-list`}
											css={[cardListStyles, snapshot.isDraggingOver && isDraggingOverColumnStyles]}
										>
											{column.items.map((item, index) => (
												<Card
													index={index}
													draggableId={item.itemId}
													item={item}
													key={item.itemId}
													rbdApi={rbdApi}
												/>
											))}
											{provided.placeholder}
										</div>
									</div>
								);
							}}
						</Droppable>
					</div>
				);
			}}
		</Draggable>
	);
});
