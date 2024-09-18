import { type CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';

import { addItemsToEvent, getFirstTextNode } from './_pdnd-test-utils';

/**
 * Same as `nativeEvent.startTextSelectionDrag` but does not also step an animation frame
 */
export function startTextSelectionDrag({ element }: { element: HTMLElement }) {
	const text = getFirstTextNode(element);

	const event = new DragEvent('dragstart', {
		cancelable: true,
		bubbles: true,
	});

	addItemsToEvent({
		event,
		items: [
			{ type: 'text/plain', data: element.textContent ?? '' },
			// Note: the outer HTML of the whole selection is dragged.
			// `element.outerHTML` is a reasonable approximation for testing
			{ type: 'text/html', data: element.outerHTML ?? '' },
		],
	});

	text.dispatchEvent(event);
}

export function clearSelection() {
	document.getSelection()?.empty();
}

export function select(element: HTMLElement): CleanupFn {
	const selection = document.getSelection();
	const range = new Range();
	range.selectNode(element);
	selection?.addRange(range);
	return clearSelection;
}
