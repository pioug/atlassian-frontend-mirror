import { fireEvent } from '@testing-library/react';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { monitorForTextSelection } from '@atlaskit/pragmatic-drag-and-drop/text-selection/adapter';

import { disableDraggingToCrossOriginIFramesForElement } from '../../../internal/pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/element';
import { disableDraggingToCrossOriginIFramesForTextSelection } from '../../../internal/pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/text-selection';

import {
	appendToBody,
	getBubbleOrderedTree,
	getElements,
	reset,
	userEvent,
} from './_pdnd-test-utils';
import { select } from './_text-selection-utils';
import { depressPointer } from './_util';

afterEach(reset);

it('should apply the fix when pressing down on a draggable [with element fix applied]', () => {
	const ordered: string[] = [];
	const [iframe] = getElements('iframe');
	iframe.title = 'test';
	iframe.src = 'https://atlassian.design';
	const [child, parent] = getBubbleOrderedTree('div');
	parent.prepend(document.createTextNode('parent'));
	child.prepend(document.createTextNode('child'));

	// validation
	expect(parent.outerHTML).toBe('<div>parent<div>child</div></div>');

	const cleanup = combine(
		appendToBody(iframe, parent),
		draggable({ element: child }),
		disableDraggingToCrossOriginIFramesForElement(),
		disableDraggingToCrossOriginIFramesForTextSelection(),
		select(parent),
		monitorForElements({
			onGenerateDragPreview() {
				ordered.push('element:preview');
			},
			onDragStart() {
				ordered.push('element:start');
			},
			onDrop() {
				ordered.push('element:drop');
			},
		}),
		monitorForTextSelection({
			onDragStart() {
				ordered.push('text-selection:start');
			},
			onDrop() {
				ordered.push('text-selection:drop');
			},
		}),
	);

	// this will _actually_ cause both registrations to start applying the fix
	depressPointer(child);

	expect(iframe).toHaveStyle('pointer-events: none');

	// starting an element drag.
	// Fix for text selection adapter will stop, but we need
	// the fix still to be applied for dragging the element.
	// userEvent.lift(child);
	fireEvent.dragStart(child);
	fireEvent.pointerCancel(child);

	// fix still applied
	expect(iframe).toHaveStyle('pointer-events: none');
	expect(ordered).toEqual(['element:preview']);
	ordered.length = 0;

	// @ts-expect-error
	requestAnimationFrame.step();

	expect(iframe).toHaveStyle('pointer-events: none');
	expect(ordered).toEqual(['element:start']);
	ordered.length = 0;

	userEvent.cancel();

	expect(ordered).toEqual(['element:drop']);
	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should apply the fix when pressing down on a draggable [no element fix applied]', () => {
	const ordered: string[] = [];
	const [iframe] = getElements('iframe');
	iframe.title = 'test';
	iframe.src = 'https://atlassian.design';
	const [child, parent] = getBubbleOrderedTree('div');
	parent.prepend(document.createTextNode('parent'));
	child.prepend(document.createTextNode('child'));

	// validation
	expect(parent.outerHTML).toBe('<div>parent<div>child</div></div>');

	const cleanup = combine(
		appendToBody(iframe, parent),
		draggable({ element: child }),
		disableDraggingToCrossOriginIFramesForTextSelection(),
		select(parent),
		monitorForElements({
			onGenerateDragPreview() {
				ordered.push('element:preview');
			},
			onDragStart() {
				ordered.push('element:start');
			},
			onDrop() {
				ordered.push('element:drop');
			},
		}),
		monitorForTextSelection({
			onDragStart() {
				ordered.push('text-selection:start');
			},
			onDrop() {
				ordered.push('text-selection:drop');
			},
		}),
	);

	// this will _actually_ cause both registrations to start applying the fix
	depressPointer(child);

	expect(iframe).toHaveStyle('pointer-events: none');

	// starting an element drag.
	// Fix for text selection adapter will stop, but we need
	// the fix still to be applied for dragging the element.
	// userEvent.lift(child);
	fireEvent.dragStart(child);
	fireEvent.pointerCancel(child);

	expect(iframe).toHaveStyle('pointer-events: none');
	expect(ordered).toEqual(['element:preview']);
	ordered.length = 0;

	// @ts-expect-error
	requestAnimationFrame.step();

	// fix was only applied for text-selection which we now
	// know was not happening. Fix is removed.
	expect(iframe).not.toHaveStyle('pointer-events: none');
	expect(ordered).toEqual(['element:start']);
	ordered.length = 0;

	userEvent.cancel();

	expect(ordered).toEqual(['element:drop']);
	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});
