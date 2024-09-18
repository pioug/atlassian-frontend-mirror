import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { disableDraggingToCrossOriginIFramesForElement } from '../../../internal/pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/element';

import { appendToBody, getElements, reset } from './_pdnd-test-utils';
import { depressPointer, releasePointer } from './_util';

const addEventListener = jest.spyOn(window, 'addEventListener');
const removeEventListener = jest.spyOn(window, 'removeEventListener');

function clearMocks() {
	addEventListener.mockClear();
	removeEventListener.mockClear();
}

afterEach(reset);
afterEach(clearMocks);
afterEach(() => releasePointer(document.body));

// Note: not adding tests for all adapter types for event listener management as they all follow
// the same code path internally.
// This test check that the registration flow correctly manages event listeners

it('should remove interaction start event listeners when there are no more registrations', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(appendToBody(iframe, element), draggable({ element }));
	clearMocks();

	const unregister1 = disableDraggingToCrossOriginIFramesForElement();

	expect(addEventListener).toHaveBeenCalledTimes(1);
	expect(addEventListener).toHaveBeenLastCalledWith('mousedown', expect.any(Function), undefined);
	expect(removeEventListener).not.toHaveBeenCalled();
	clearMocks();

	// make some more registrations
	const unregister2 = disableDraggingToCrossOriginIFramesForElement();
	const unregister3 = disableDraggingToCrossOriginIFramesForElement();

	// no more event listeners called
	expect(addEventListener).not.toHaveBeenCalled();
	expect(removeEventListener).not.toHaveBeenCalled();

	// removing all registrations
	unregister1();
	unregister2();
	unregister3();

	// expecting single event listener has been removed
	expect(addEventListener).not.toHaveBeenCalled();
	expect(removeEventListener).toHaveBeenCalledTimes(1);
	expect(removeEventListener).toHaveBeenLastCalledWith(
		'mousedown',
		expect.any(Function),
		undefined,
	);

	cleanup();
});

it('should remove interaction end event listeners when the interaction ends', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(appendToBody(iframe, element), draggable({ element }));
	clearMocks();

	const unregister = disableDraggingToCrossOriginIFramesForElement();

	expect(addEventListener).toHaveBeenCalledTimes(1);
	expect(addEventListener).toHaveBeenLastCalledWith('mousedown', expect.any(Function), undefined);
	expect(removeEventListener).not.toHaveBeenCalled();
	clearMocks();

	// cause the fix to be applied.
	depressPointer(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	const addedCount = addEventListener.mock.calls.length;
	expect(addedCount).toBeGreaterThan(0);
	expect(removeEventListener).not.toHaveBeenCalled();
	clearMocks();

	// release the fix
	releasePointer(element);

	// fix no longer applied
	expect(iframe).not.toHaveStyle('pointer-events: none');
	// all added interaction end event listeners removed
	expect(removeEventListener).toHaveBeenCalledTimes(addedCount);
	// no more event listeners added
	expect(addEventListener).not.toHaveBeenCalled();

	unregister();
	cleanup();
});

it('should remove interaction start and end event listeners when last registration is removed during an interaction', () => {
	const [iframe] = getElements('iframe');
	const [element] = getElements('div');
	iframe.src = 'https://atlassian.design';
	const cleanup = combine(appendToBody(iframe, element), draggable({ element }));
	clearMocks();

	const unregister = disableDraggingToCrossOriginIFramesForElement();

	expect(addEventListener).toHaveBeenCalledTimes(1);
	expect(addEventListener).toHaveBeenLastCalledWith('mousedown', expect.any(Function), undefined);
	expect(removeEventListener).not.toHaveBeenCalled();
	clearMocks();

	// cause the fix to be applied.
	depressPointer(element);

	expect(iframe).toHaveStyle('pointer-events: none');

	const addedCount = addEventListener.mock.calls.length;
	expect(addedCount).toBeGreaterThan(0);
	expect(removeEventListener).not.toHaveBeenCalled();
	clearMocks();

	// unregistering fix while fix is being applied
	unregister();

	// validating fix is still being applied
	expect(iframe).toHaveStyle('pointer-events: none');

	// interaction start event listener removed
	expect(removeEventListener).toHaveBeenCalledTimes(1);
	expect(removeEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function), undefined);
	expect(addEventListener).not.toHaveBeenCalled();
	clearMocks();

	// release the fix
	releasePointer(element);

	expect(iframe).not.toHaveStyle('pointer-events: none');
	expect(removeEventListener).toHaveBeenCalledTimes(addedCount);
	expect(addEventListener).not.toHaveBeenCalled();

	unregister();
	cleanup();
});
