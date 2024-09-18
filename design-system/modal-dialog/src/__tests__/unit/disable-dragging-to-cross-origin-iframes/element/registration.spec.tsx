import { fireEvent } from '@testing-library/react';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { disableDraggingToCrossOriginIFramesForElement } from '../../../../internal/pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/element';
import { appendToBody, getElements, reset } from '../_pdnd-test-utils';
import { depressPointer, releasePointer } from '../_util';

afterEach(reset);
afterEach(() => releasePointer(document.body));

it('should apply the fix while there are multiple registrations', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(
		appendToBody(iframe, element),
		draggable({ element }),
		disableDraggingToCrossOriginIFramesForElement(),
		disableDraggingToCrossOriginIFramesForElement(),
		disableDraggingToCrossOriginIFramesForElement(),
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
	iframe.src = 'https://atlassian.design';
	const unregister1 = disableDraggingToCrossOriginIFramesForElement();
	const unregister2 = disableDraggingToCrossOriginIFramesForElement();
	const cleanup = combine(appendToBody(iframe, element), draggable({ element }));

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
	iframe.src = 'https://atlassian.design';
	const unregister = disableDraggingToCrossOriginIFramesForElement();
	const cleanup = combine(appendToBody(iframe, element), draggable({ element }));

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
	iframe.src = 'https://atlassian.design';
	let isDragging = false;
	const unregister = disableDraggingToCrossOriginIFramesForElement();
	const cleanup = combine(
		appendToBody(iframe, element),
		draggable({ element }),
		monitorForElements({
			onGenerateDragPreview() {
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
	fireEvent.dragStart(element);
	fireEvent.pointerCancel(element);

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
