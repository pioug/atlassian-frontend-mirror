import { fireEvent } from '@testing-library/react';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { disableDraggingToCrossOriginIFramesForElement } from '../../../../internal/pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/element';
import { appendToBody, getBubbleOrderedTree, getElements, reset } from '../_pdnd-test-utils';
import { depressPointer, releasePointer } from '../_util';

afterEach(reset);
afterEach(() => releasePointer(document.body));

it('should apply the fix when pressing down on a draggable', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(
		appendToBody(iframe, element),
		draggable({ element }),
		disableDraggingToCrossOriginIFramesForElement(),
	);

	depressPointer(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	cleanup();
});

it('should apply the fix when pressing down inside a draggable', () => {
	const [iframe] = getElements('iframe');
	const [child, parent] = getBubbleOrderedTree();
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(
		appendToBody(iframe, parent),
		draggable({ element: parent }),
		disableDraggingToCrossOriginIFramesForElement(),
	);

	fireEvent.mouseDown(child);

	expect(iframe).toHaveStyle('pointer-events: none');

	cleanup();
});

it('should not apply when pressing down in an element that is not draggable', async () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(
		appendToBody(iframe, element),
		disableDraggingToCrossOriginIFramesForElement(),
	);

	depressPointer(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should not apply to iframes on the same origin', async () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	iframe.src = window.location.href;
	const cleanup = combine(
		appendToBody(iframe, element),
		disableDraggingToCrossOriginIFramesForElement(),
	);

	depressPointer(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should not apply to iframes with a srcdoc', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	iframe.srcdoc = '<!doctype html><body>Hello</body>';
	const cleanup = combine(
		appendToBody(iframe, element),
		disableDraggingToCrossOriginIFramesForElement(),
	);

	depressPointer(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should not apply to iframes with src="data:$html"', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	iframe.src = `data:text/html;charset=utf-8,${encodeURI('<!doctype html><body>Hello</body>')}`;
	const cleanup = combine(
		appendToBody(iframe, element),
		disableDraggingToCrossOriginIFramesForElement(),
	);

	depressPointer(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should block multiple cross domain iframes', async () => {
	const [onSameDomain1, onSameDomain2, onDifferentDomain1, onDifferentDomain2] =
		getElements('iframe');
	const [element] = getElements('div');

	onSameDomain1.src = window.location.href;
	onSameDomain2.src = window.location.href;
	onDifferentDomain1.src = 'https://atlassian.design';
	onDifferentDomain2.src = 'https://domevents.dev';
	const cleanup = combine(
		appendToBody(onSameDomain1, onSameDomain2, onDifferentDomain1, onDifferentDomain2, element),
		draggable({ element }),
		disableDraggingToCrossOriginIFramesForElement(),
	);

	depressPointer(element);

	expect(onSameDomain1).not.toHaveStyle('pointer-events: none');
	expect(onSameDomain2).not.toHaveStyle('pointer-events: none');
	expect(onDifferentDomain1).toHaveStyle('pointer-events: none');
	expect(onDifferentDomain2).toHaveStyle('pointer-events: none');

	cleanup();
});

it('should clear the fix on "pointerup" [if there was no drag]', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(
		appendToBody(iframe, element),
		draggable({ element }),
		disableDraggingToCrossOriginIFramesForElement(),
	);

	depressPointer(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	releasePointer(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should clear fix in "dragstart" [if there was no managed drag]', async () => {
	const [iframe] = getElements('iframe');
	const [managed, unmanaged] = getElements('div');
	unmanaged.draggable = true;
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(
		appendToBody(iframe, managed, unmanaged),
		draggable({ element: managed }),
		disableDraggingToCrossOriginIFramesForElement(),
	);

	fireEvent.mouseDown(unmanaged);

	expect(iframe).toHaveStyle('pointer-events: none');

	// an unmanaged drag
	fireEvent.dragStart(unmanaged);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should maintain the fix through a drag if a drag is started', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(
		appendToBody(iframe, element),
		draggable({ element }),
		disableDraggingToCrossOriginIFramesForElement(),
	);

	depressPointer(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	// a "pointercancel" will occur after a "dragstart"
	fireEvent.dragStart(element);
	fireEvent.pointerCancel(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	fireEvent.dragEnd(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should handle broken drags', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(
		appendToBody(iframe, element),
		draggable({ element }),
		disableDraggingToCrossOriginIFramesForElement(),
	);

	depressPointer(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	// a "pointercancel" will occur after a "dragstart"
	fireEvent.dragStart(element);
	fireEvent.pointerCancel(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	// "dragend" event not fired (broken drag)
	// firing a "pointerdown" that will signal a broken drag
	// as well as be the signal for a the fix to be applied again
	depressPointer(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	releasePointer(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});
