import React from 'react';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import type { InteractionTaskArgs, PublicInteractionTask } from 'storybook-addon-performance';
import invariant from 'tiny-invariant';

import Board from './pieces/board';
import { type RbdApi } from './pieces/types';
import { getColumn, getColumnItems, getColumnOrder, getItem } from './utils/board-utils';
import { userEvent } from './utils/user-event';

const rbdApi: RbdApi = {
	DragDropContext,
	Draggable,
	Droppable,
};

const boardRbd = () => <Board rbdApi={rbdApi} />;

const interactions: PublicInteractionTask[] = [
	{
		name: 'Pick up a card (mouse)',
		description: 'Recording how long it takes to pick up a card',
		run: async ({ container, controls }: InteractionTaskArgs): Promise<void> => {
			const itemA0 = getItem(container, 'A0');
			controls.time(async () => {
				userEvent.rbdMouse.lift({ element: itemA0 });
			});
			invariant(itemA0.getAttribute('data-is-dragging') === 'true', 'isDragging');
			userEvent.rbdMouse.cancel({ dragHandle: itemA0 });
		},
	},
	{
		name: 'Reorder a card (mouse)',
		description: 'Recording how long it takes to reorder a card in the same list',
		run: async ({ container, controls }: InteractionTaskArgs): Promise<void> => {
			const itemA0 = getItem(container, 'A0');
			const itemA2 = getItem(container, 'A2');
			await controls.time(async () => {
				await userEvent.rbdMouse.dragAndDrop({
					element: itemA0,
					target: itemA2,
				});
			});
			const columnItems = getColumnItems(container, 'A');
			invariant(columnItems[0].getAttribute('data-testid') === 'item-A1');
			invariant(columnItems[1].getAttribute('data-testid') === 'item-A0');
		},
	},
	{
		name: 'Move a card (mouse)',
		description: 'Recording how long it takes to move a card to another list',
		run: async ({ container, controls }: InteractionTaskArgs): Promise<void> => {
			const itemA0 = getItem(container, 'A0');
			const itemB0 = getItem(container, 'B0');
			await controls.time(async () => {
				await userEvent.rbdMouse.dragAndDrop({
					element: itemA0,
					target: itemB0,
				});
			});
			invariant(getColumnItems(container, 'A')[0].getAttribute('data-testid') === 'item-A1');
			invariant(getColumnItems(container, 'B')[0].getAttribute('data-testid') === 'item-A0');
		},
	},
	{
		name: 'Reorder a column (mouse)',
		description: 'Recording how long it takes to reorder a column',
		run: async ({ container, controls }: InteractionTaskArgs): Promise<void> => {
			const columnA = getColumn(container, 'A');
			const columnC = getColumn(container, 'C');
			await controls.time(async () => {
				await userEvent.rbdMouse.dragAndDrop({
					element: columnA.dragHandle,
					target: columnC.element,
				});
			});
			const columnOrder = getColumnOrder(container);
			invariant(columnOrder[0] === 'column-B');
		},
	},
];

boardRbd.story = {
	name: 'Board (react-beautiful-dnd)',
	parameters: {
		performance: {
			interactions,
		},
	},
};

export default boardRbd;
