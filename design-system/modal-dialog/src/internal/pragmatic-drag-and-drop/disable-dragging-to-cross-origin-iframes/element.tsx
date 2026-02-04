import { bind, bindAll } from 'bind-event-listener';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { type CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';

import { makeFixForAdapter } from './make-fix-for-adapter';

function watchForInteractionEnd({ stop }: { stop: () => void }): CleanupFn {
	let isDragging: boolean = false;

	function stopIfNotDragging() {
		if (isDragging) {
			return;
		}
		stop();
	}

	const unbindEvents = bindAll(
		window,
		[
			{
				// Another interaction is starting, this fix should be removed.
				type: 'pointerdown',
				listener: stop,
			},
			{
				// The user did not start a drag
				type: 'pointerup',
				listener: stopIfNotDragging,
			},
			{
				// if a "dragstart" occurs and the flag is not set,
				// then a drag has not started.
				// Note: could not use "pointercancel" as it is not
				// published in Safari
				// → https://bugs.webkit.org/show_bug.cgi?id=222632
				type: 'dragstart',
				listener: stopIfNotDragging,
				// Need to come after the element adapter
				options: { capture: false },
			},
		],
		{
			// Listening in the capture phase to increase resilience
			// against events being stopped.
			capture: true,
			// Being super clear these should only run once
			once: true,
		},
	);

	const unbindMonitor = monitorForElements({
		onGenerateDragPreview() {
			isDragging = true;
		},
		onDrop() {
			isDragging = false;
			stop();
		},
	});

	return combine(unbindEvents, unbindMonitor);
}

function watchForInteractionStart({ start }: { start: () => void }): CleanupFn {
	return bind(window, {
		// Note: Using "mousedown" rather than "pointerdown" due to a Safari bug.
		// Safari not publish a "pointerdown" on the interaction after a drag
		// → https://bugs.webkit.org/show_bug.cgi?id=279749
		type: 'mousedown',
		listener(event) {
			// Only starting if pressing down inside a draggable element
			// At this point, we are not sure which if:
			// 1. a text selection drag is starting
			// 2. a draggable managed by pdnd is going to be dragged
			// 3. a draggable not managed by pdnd is going to be dragged
			// 4. The user will be dragging anything at all (might be doing a click)
			if (event.target instanceof HTMLElement && event.target.closest('[draggable="true"]')) {
				start();
			}
		},
	});
}

const api = makeFixForAdapter({
	watchForInteractionStart,
	watchForInteractionEnd,
});

export function disableDraggingToCrossOriginIFramesForElement(): CleanupFn {
	return api.registerUsage();
}
