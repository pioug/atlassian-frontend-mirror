import { bind } from 'bind-event-listener';

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
import type { BaseEventPayload, ElementDragType } from '@atlaskit/pragmatic-drag-and-drop/types';

export const createPragmaticResizer = ({
	target,
	onDragStart,
	onDrag,
	onDrop,
}: {
	target: HTMLElement;
	onDragStart: (args: BaseEventPayload<ElementDragType>) => void;
	onDrag: (args: BaseEventPayload<ElementDragType>) => void;
	onDrop: (args: BaseEventPayload<ElementDragType>) => void;
}) => {
	let state: 'default' | 'resizing' = 'default';

	const createHandle = (side: 'left' | 'right') => {
		const handle = document.createElement('div');
		handle.contentEditable = 'false';
		handle.classList.add('pm-breakout-resize-handle-container');

		const rail = document.createElement('div');
		rail.classList.add('pm-breakout-resize-handle-rail');

		if (side === 'left') {
			handle.classList.add('pm-breakout-resize-handle-container--left');
			handle.setAttribute('data-testid', 'pragmatic-resizer-handle-left');
		} else {
			handle.classList.add('pm-breakout-resize-handle-container--right');
			handle.setAttribute('data-testid', 'pragmatic-resizer-handle-right');
		}

		const handleHitBox = document.createElement('div');
		handleHitBox.classList.add('pm-breakout-resize-handle-hit-box');

		const thumb = document.createElement('div');
		thumb.classList.add('pm-breakout-resize-handle-thumb');

		rail.appendChild(thumb);
		handle.appendChild(rail);
		handle.appendChild(handleHitBox);

		return { handle, rail, handleHitBox };
	};

	const rightHandle = createHandle('right');
	const leftHandle = createHandle('left');

	const registerHandle = (handleElement: HTMLElement, handleSide: 'left' | 'right') => {
		return draggable({
			element: handleElement,
			onGenerateDragPreview: ({ nativeSetDragImage }) => {
				disableNativeDragPreview({ nativeSetDragImage });
				preventUnhandled.start();
			},
			getInitialData: () => ({ handleSide }),
			onDragStart(args) {
				state = 'resizing';
				handleElement.classList.add('pm-breakout-resize-handle-container--active');

				onDragStart(args);
			},
			onDrag,
			onDrop(args) {
				preventUnhandled.stop();

				state = 'default';
				handleElement.classList.remove('pm-breakout-resize-handle-container--active');

				onDrop(args);
			},
		});
	};

	const registerEvents = (element: HTMLElement) => {
		return [
			bind(element, {
				type: 'mouseenter',
				listener: () => {
					rightHandle.rail.style.setProperty('opacity', '1');
					leftHandle.rail.style.setProperty('opacity', '1');
				},
			}),
			bind(element, {
				type: 'mouseleave',
				listener: () => {
					if (state === 'resizing') {
						return;
					}
					rightHandle.rail.style.removeProperty('opacity');
					leftHandle.rail.style.removeProperty('opacity');
				},
			}),
		];
	};

	const unbindFns = [
		...registerEvents(target),
		...registerEvents(rightHandle.handleHitBox),
		...registerEvents(leftHandle.handleHitBox),
		...registerEvents(rightHandle.rail),
		...registerEvents(leftHandle.rail),
	];

	const destroyFns = [
		registerHandle(rightHandle.handle, 'right'),
		registerHandle(leftHandle.handle, 'left'),
	];

	return {
		rightHandle: rightHandle.handle,
		leftHandle: leftHandle.handle,
		destroy: () => {
			destroyFns.forEach((destroyFn) => destroyFn());
			unbindFns.forEach((unbindFn) => unbindFn());
		},
	};
};
