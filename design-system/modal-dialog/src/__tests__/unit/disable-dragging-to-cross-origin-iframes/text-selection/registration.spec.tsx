import { fireEvent } from '@testing-library/react';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForTextSelection } from '@atlaskit/pragmatic-drag-and-drop/text-selection/adapter';

import { disableDraggingToCrossOriginIFramesForTextSelection } from '../../../../internal/pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/text-selection';
import { appendToBody, getElements, reset } from '../_pdnd-test-utils';
import { clearSelection, select, startTextSelectionDrag } from '../_text-selection-utils';
import { depressPointer, releasePointer } from '../_util';

afterEach(reset);
afterEach(clearSelection);
afterEach(() => releasePointer(document.body));

it('should apply the fix while there are multiple registrations', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	element.textContent = 'Hello';
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(
		appendToBody(iframe, element),
		select(element),
		disableDraggingToCrossOriginIFramesForTextSelection(),
		disableDraggingToCrossOriginIFramesForTextSelection(),
		disableDraggingToCrossOriginIFramesForTextSelection(),
	);

	depressPointer(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	releasePointer(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should remove the fix when there are no more registrations', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	element.textContent = 'Hello';
	iframe.src = 'https://atlassian.design';
	const unregister1 = disableDraggingToCrossOriginIFramesForTextSelection();
	const unregister2 = disableDraggingToCrossOriginIFramesForTextSelection();
	const cleanup = combine(appendToBody(iframe, element), select(element));

	depressPointer(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	releasePointer(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	// Unregistering first - fix should still be applied
	unregister1();

	depressPointer(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	releasePointer(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	// Removing last registration - expecting fix no longer applied

	unregister2();

	depressPointer(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should not disable the fix if the cleanup function is called while the pointer is down', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	element.textContent = 'Hello';
	iframe.src = 'https://atlassian.design';
	const unregister = disableDraggingToCrossOriginIFramesForTextSelection();
	const cleanup = combine(appendToBody(iframe, element), select(element));

	depressPointer(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	unregister();

	// fix is still applied
	expect(iframe).toHaveStyle('pointer-events: none');

	cleanup();
});

it('should not disable the fix if the cleanup function is called while their is a drag', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	element.textContent = 'Hello';
	iframe.src = 'https://atlassian.design';
	let isDragging = false;
	const unregister = disableDraggingToCrossOriginIFramesForTextSelection();
	const cleanup = combine(
		appendToBody(iframe, element),
		select(element),
		monitorForTextSelection({
			onDragStart() {
				isDragging = true;
			},
			onDrop() {
				isDragging = false;
			},
		}),
	);

	depressPointer(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	// start a drag
	startTextSelectionDrag({ element });
	fireEvent.pointerCancel(element);

	// isDragging won't be set until the next frame
	expect(isDragging).toBe(false);

	// fix being applied already
	expect(iframe).toHaveStyle('pointer-events: none');

	// @ts-expect-error
	requestAnimationFrame.step();

	expect(isDragging).toBe(true);

	// fix being applied while dragging
	expect(iframe).toHaveStyle('pointer-events: none');

	// fix unregistered during drag
	unregister();

	// fix is still applied
	expect(iframe).toHaveStyle('pointer-events: none');

	fireEvent.dragEnd(element);

	expect(isDragging).toBe(false);
	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});
