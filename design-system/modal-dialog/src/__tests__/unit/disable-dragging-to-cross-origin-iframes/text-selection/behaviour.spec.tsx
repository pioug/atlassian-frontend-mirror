import { fireEvent } from '@testing-library/react';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

import { disableDraggingToCrossOriginIFramesForTextSelection } from '../../../../internal/pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/text-selection';
import { appendToBody, getElements, reset } from '../_pdnd-test-utils';
import { clearSelection, select, startTextSelectionDrag } from '../_text-selection-utils';
import { depressPointer, releasePointer } from '../_util';

afterEach(reset);
afterEach(clearSelection);
afterEach(() => releasePointer(document.body));

it('should apply the fix when pressing down and there is a selection', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	element.textContent = 'Hello';
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(
		appendToBody(iframe, element),
		disableDraggingToCrossOriginIFramesForTextSelection(),
		select(element),
	);

	depressPointer(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	cleanup();
});

it('should not apply the when pressing down and there is no selection', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	element.textContent = 'Hello';
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(
		appendToBody(iframe, element),
		disableDraggingToCrossOriginIFramesForTextSelection(),
	);

	depressPointer(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should not apply to iframes on the same origin', async () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	element.textContent = 'Hello';
	iframe.src = window.location.href;
	const cleanup = combine(
		appendToBody(iframe, element),
		disableDraggingToCrossOriginIFramesForTextSelection(),
		select(element),
	);

	depressPointer(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should not apply to iframes with a srcdoc', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	element.textContent = 'Hello';
	iframe.srcdoc = '<!doctype html><body>Hello</body>';
	const cleanup = combine(
		appendToBody(iframe, element),
		disableDraggingToCrossOriginIFramesForTextSelection(),
		select(element),
	);

	depressPointer(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should not apply to iframes with src="data:$html"', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	element.textContent = 'Hello';
	iframe.src = `data:text/html;charset=utf-8,${encodeURI('<!doctype html><body>Hello</body>')}`;
	const cleanup = combine(
		appendToBody(iframe, element),
		disableDraggingToCrossOriginIFramesForTextSelection(),
		select(element),
	);

	depressPointer(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should block multiple cross domain iframes', async () => {
	const [onSameDomain1, onSameDomain2, onDifferentDomain1, onDifferentDomain2] =
		getElements('iframe');
	const [element] = getElements('div');
	element.textContent = 'hello';

	onSameDomain1.src = window.location.href;
	onSameDomain2.src = window.location.href;
	onDifferentDomain1.src = 'https://atlassian.design';
	onDifferentDomain2.src = 'https://domevents.dev';
	const cleanup = combine(
		appendToBody(onSameDomain1, onSameDomain2, onDifferentDomain1, onDifferentDomain2, element),
		disableDraggingToCrossOriginIFramesForTextSelection(),
		select(element),
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
	element.textContent = 'Hello';
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(
		appendToBody(iframe, element),
		disableDraggingToCrossOriginIFramesForTextSelection(),
		select(element),
	);

	depressPointer(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	releasePointer(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should clear the fix after "dragstart" [if there was no drag]', async () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	element.textContent = 'Hello';
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(
		appendToBody(iframe, element),
		disableDraggingToCrossOriginIFramesForTextSelection(),
		select(element),
	);

	depressPointer(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	// start a drag
	fireEvent.dragStart(element);
	fireEvent.pointerCancel(element);

	// fix still applied until next frame (when we determine if a drag has started)
	expect(iframe).toHaveStyle('pointer-events: none');

	// @ts-expect-error
	requestAnimationFrame.step();

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should maintain the fix through a drag if a drag is started', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	element.textContent = 'Alex';
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(
		appendToBody(iframe, element),
		disableDraggingToCrossOriginIFramesForTextSelection(),
		select(element),
	);

	depressPointer(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	// a "pointercancel" will occur after a "dragstart"
	startTextSelectionDrag({ element });
	fireEvent.pointerCancel(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	// @ts-expect-error
	requestAnimationFrame.step();

	// fix still applied after a frame (making it through our "pointercancel" check)
	expect(iframe).toHaveStyle('pointer-events: none');

	fireEvent.dragEnd(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});

it('should not error if unregistered during "dragstart" (testing frame cleanup logic)', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	element.textContent = 'Alex';
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(appendToBody(iframe, element), select(element));
	const unregisterFix = disableDraggingToCrossOriginIFramesForTextSelection();

	depressPointer(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	// a "pointercancel" will occur after a "dragstart"
	startTextSelectionDrag({ element });
	fireEvent.pointerCancel(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	// should not cause any problems
	unregisterFix();

	expect(iframe).toHaveStyle('pointer-events: none');

	// will cause the fix to be removed
	fireEvent.dragEnd(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');

	// Another frame should not break anything
	// @ts-expect-error
	requestAnimationFrame.step();

	expect(iframe).not.toHaveStyle('pointer-events: none');

	cleanup();
});
