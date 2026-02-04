import { bind, bindAll } from 'bind-event-listener';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForTextSelection } from '@atlaskit/pragmatic-drag-and-drop/text-selection/adapter';
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
	let frameId: null | number = null;

	const unbindEvents = bindAll(
		window,
		[
			{
				// User is starting another interaction
				type: 'pointerdown',
				listener: stop,
			},
			{
				// User did not start a drag.
				// "pointerdown" won't be fired if a drag started
				type: 'pointerup',
				listener: stopIfNotDragging,
			},
			{
				type: 'dragstart',
				listener() {
					/**
					 * The pdnd `onDragStart()` fires in the frame after "dragstart"
					 * So we are delaying our isDragging check to give a chance
					 * for `onDragStart()` to set the value correctly.
					 *
					 * Note: could not use "pointercancel" as it is not
					 * published in Safari → https://bugs.webkit.org/show_bug.cgi?id=222632
					 */
					frameId = requestAnimationFrame(() => {
						frameId = null;
						stopIfNotDragging();
					});
				},
				// need to schedule our frame after the text-selection
				// adapter queues it's `onDragStart` frame.
				options: { capture: false },
			},
		],
		{
			// Listening in the capture phase to increase resilience
			// against events being stopped.
			capture: true,
			// being super clear these should only run once
			once: true,
		},
	);

	const unbindMonitor = monitorForTextSelection({
		onDragStart() {
			isDragging = true;
		},
		onDrop() {
			isDragging = false;
			stop();
		},
	});

	return combine(unbindEvents, unbindMonitor, function abortFrame() {
		if (frameId != null) {
			cancelAnimationFrame(frameId);
		}
	});
}

function watchForInteractionStart({ start }: { start: () => void }): CleanupFn {
	return bind(window, {
		// Note: Using "mousedown" rather than "pointerdown" due to a Safari bug.
		// Safari not publish a "pointerdown" on the interaction after a drag
		// → https://bugs.webkit.org/show_bug.cgi?id=279749
		type: 'mousedown',
		listener() {
			// A text selection drag will only start when there is
			// an active text selection.
			const selection = window.getSelection();

			// No selection object found
			if (!selection) {
				return;
			}

			// `isCollapsed` is "true" if there is currently no selected text
			if (selection.isCollapsed) {
				return;
			}

			start();
		},
	});
}

const api = makeFixForAdapter({
	watchForInteractionStart,
	watchForInteractionEnd,
});

export function disableDraggingToCrossOriginIFramesForTextSelection(): CleanupFn {
	return api.registerUsage();
}
