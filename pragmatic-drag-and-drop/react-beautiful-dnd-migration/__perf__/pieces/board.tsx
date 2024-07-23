/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { DropResult } from 'react-beautiful-dnd';

import { getInitialData, moveCard, reorderCard, reorderColumn } from '../../examples/data/tasks';

import { Column } from './board-column';
import type { RbdApi } from './types';

const boardStyles = css({
	display: 'flex',
	justifyContent: 'center',
	flexDirection: 'row',
	height: 480,
});

type BoardProps = {
	rbdApi: RbdApi;
};

export default function Board({ rbdApi }: BoardProps) {
	const { DragDropContext, Droppable } = rbdApi;

	const [data, setData] = useState(() => getInitialData());

	const onDragEnd = useCallback((result: DropResult) => {
		const { source, destination, type } = result;

		// didn't drop on anything
		if (!destination) {
			return;
		}

		if (type === 'column') {
			setData((data) => reorderColumn(data, result));
			return;
		}

		if (type === 'card') {
			if (source.droppableId === destination.droppableId) {
				// same column
				setData((data) => reorderCard(data, result));
				return;
			}

			// moving to a new column
			setData((data) => moveCard(data, result));
		}
	}, []);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="board" type="column" direction="horizontal">
				{(provided) => {
					return (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							data-testid="board"
							css={boardStyles}
						>
							{data.orderedColumnIds.map((columnId, index) => {
								return (
									<Column
										index={index}
										droppableId={columnId}
										column={data.columnMap[columnId]}
										key={columnId}
										rbdApi={rbdApi}
									/>
								);
							})}
							{provided.placeholder}
						</div>
					);
				}}
			</Droppable>
		</DragDropContext>
	);
}
