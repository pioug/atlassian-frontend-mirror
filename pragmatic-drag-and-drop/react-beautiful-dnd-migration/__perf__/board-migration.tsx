import React from 'react';

import type { InteractionTaskArgs, PublicInteractionTask } from 'storybook-addon-performance';
import invariant from 'tiny-invariant';

import { DragDropContext, Draggable, Droppable } from '../src';

import Board from './pieces/board';
import { type RbdApi } from './pieces/types';
import { getColumn, getColumnItems, getColumnOrder, getItem } from './utils/board-utils';
import { userEvent, waitForAnimationFrame } from './utils/user-event';

const rbdApi: RbdApi = {
	// @ts-expect-error
	DragDropContext,
	// @ts-expect-error
	Draggable,
	// @ts-expect-error
	Droppable,
};

const boardMigration = () => <Board rbdApi={rbdApi} />;

async function waitUntilElementIsDraggable(element: HTMLElement): Promise<void> {
	return new Promise((resolve) => {
		/**
		 * pdnd is not set up synchronously.
		 *
		 * We can tell when it is ready when an element becomes draggable.
		 */
		const observer = new MutationObserver(() => {
			if (element.draggable) {
				observer.disconnect();
				resolve();
			}
		});

		/**
		 * Only changes to the draggable attribute will trigger the above observer.
		 */
		observer.observe(element, { attributeFilter: ['draggable'] });
	});
}

async function waitUntilDropTargetReady(element: HTMLElement): Promise<void> {
	return new Promise((resolve) => {
		/**
		 * pdnd is not set up synchronously.
		 *
		 * We can tell when it is ready when an element becomes draggable.
		 */
		const observer = new MutationObserver(() => {
			if (element.getAttribute('data-drop-target-for-element') === 'true') {
				observer.disconnect();
				resolve();
			}
		});

		/**
		 * Only changes to the draggable attribute will trigger the above observer.
		 */
		observer.observe(element, {
			attributeFilter: ['data-drop-target-for-element'],
		});
	});
}

const interactions: PublicInteractionTask[] = [
	{
		name: 'Pick up a card (mouse)',
		description: 'Recording how long it takes to pick up a card',
		run: async ({ container, controls }: InteractionTaskArgs): Promise<void> => {
			const itemA0 = getItem(container, 'A0');
			await waitUntilElementIsDraggable(itemA0);
			controls.time(async () => {
				userEvent.nativePointer.lift({ element: itemA0, dragHandle: itemA0 });
			});
			await waitForAnimationFrame();
			invariant(itemA0.getAttribute('data-is-dragging') === 'true', 'isDragging');
			userEvent.nativePointer.cancel({ dragHandle: itemA0 });
		},
	},
	{
		name: 'Reorder a card (mouse)',
		description: 'Recording how long it takes to reorder a card in the same list',
		run: async ({ container, controls }: InteractionTaskArgs): Promise<void> => {
			const itemA0 = getItem(container, 'A0');
			const itemA2 = getItem(container, 'A2');
			await waitUntilElementIsDraggable(itemA0);
			await controls.time(async () => {
				await userEvent.nativePointer.dragAndDrop({
					element: itemA0,
					dragHandle: itemA0,
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
			await waitUntilElementIsDraggable(itemA0);
			await controls.time(async () => {
				await userEvent.nativePointer.dragAndDrop({
					element: itemA0,
					dragHandle: itemA0,
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
			await Promise.all([
				waitUntilElementIsDraggable(columnA.element),
				waitUntilDropTargetReady(columnC.element),
			]);
			await controls.time(async () => {
				await userEvent.nativePointer.dragAndDrop({
					element: columnA.element,
					dragHandle: columnA.dragHandle,
					target: columnC.element,
				});
			});
			const columnOrder = getColumnOrder(container);
			invariant(columnOrder[0] === 'column-B');
		},
	},
];

boardMigration.story = {
	name: 'Board (migration layer)',
	parameters: {
		performance: {
			interactions,
		},
	},
};

export default boardMigration;
