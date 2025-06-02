import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
import type { BaseEventPayload, ElementDragType } from '@atlaskit/pragmatic-drag-and-drop/types';

export const createPragmaticResizer = ({
	onDragStart,
	onDrag,
	onDrop,
}: {
	onDragStart: () => void;
	onDrag: (args: BaseEventPayload<ElementDragType>) => void;
	onDrop: (args: BaseEventPayload<ElementDragType>) => void;
}) => {
	const registerHandle = (handleElement: HTMLElement) => {
		return draggable({
			element: handleElement,
			onGenerateDragPreview: ({ nativeSetDragImage }) => {
				disableNativeDragPreview({ nativeSetDragImage });
				preventUnhandled.start();
			},
			onDragStart,
			onDrag,
			onDrop(args) {
				preventUnhandled.stop();
				onDrop(args);
			},
		});
	};

	const createHandle = (side: 'left' | 'right') => {
		const handle = document.createElement('div');
		handle.contentEditable = 'false';
		handle.classList.add('pm-breakout-resize-handle');

		if (side === 'left') {
			handle.classList.add('pm-breakout-resize-handle-left');
			handle.setAttribute('data-testid', 'pragmatic-resizer-handle-left');
		} else {
			handle.classList.add('pm-breakout-resize-handle-right');
			handle.setAttribute('data-testid', 'pragmatic-resizer-handle-right');
		}

		const handleInner = document.createElement('div');
		handleInner.classList.add('pm-breakout-resize-handle-inner');

		handle.appendChild(handleInner);

		return handle;
	};

	const rightHandle = createHandle('right');
	const leftHandle = createHandle('left');

	const rightHandleCleanup = registerHandle(rightHandle);
	const leftHandleCleanup = registerHandle(leftHandle);

	return {
		rightHandle,
		leftHandle,
		destroy: () => {
			rightHandleCleanup();
			leftHandleCleanup();
		},
	};
};
