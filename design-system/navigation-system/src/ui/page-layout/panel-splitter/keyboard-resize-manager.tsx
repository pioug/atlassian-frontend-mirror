import type { ResizeEndCallback, ResizeStartCallback } from './types';

type ResizingState =
	| { type: 'idle' }
	| {
			type: 'resizing';
			/**
			 * The initial width from the first resize event needs to be stored for the onResizeEnd call, as each subsequent keyboard resize
			 * has a new `initialWidth` value based on the current panel width.
			 */
			initialWidth: number;
			/**
			 * Cancels the timeout to reset the state to idle.
			 */
			abort: () => void;
	  };

/**
 * The debounce time for the PanelSplitter resize callback functions.
 *
 * - For `onResizeStart`, it will call the callback immediately, but not
 * again until the user stops resizing and this wait time has passed.
 * - For `onResizeEnd`, it will call the callback only after this time has
 * passed since the last resize event.
 */
const resizeCallbackDebounceTimeMs = 500;

/**
 * Returns an instance of a state machine manager for keyboard resizing.
 * It handles calling the `onResizeStart` and `onResizeEnd` callbacks appropriately, as the user "starts" and "finishes" resizing
 * using the keyboard, to prevent calling them on every keydown.
 *
 * - `onResizeStart` is called immediately when the user starts resizing
 * - `onResizeEnd` is called after a wait time when the user stops resizing.
 */
export function createKeyboardResizeManager({
	onResizeStart,
	onResizeEnd,
}: {
	onResizeStart: ResizeStartCallback;
	onResizeEnd: ResizeEndCallback;
}) {
	let resizingState: ResizingState = {
		type: 'idle',
	};

	/**
	 * Starts a timer to reset the state to idle and call `onResizeEnd` after a wait time.
	 */
	function startResizeEndTimer({ initialWidth, finalWidth }: Parameters<ResizeEndCallback>[0]) {
		const markResizeAsEndedTimeout = setTimeout(() => {
			onResizeEnd({ initialWidth, finalWidth });
			resizingState = { type: 'idle' };
		}, resizeCallbackDebounceTimeMs);

		resizingState = {
			type: 'resizing',
			initialWidth,
			abort() {
				clearTimeout(markResizeAsEndedTimeout);
			},
		};
	}

	function onResize({ initialWidth, finalWidth }: Parameters<ResizeEndCallback>[0]) {
		if (resizingState.type === 'idle') {
			// If the state was idle, this counts as a resize start event.
			onResizeStart({ initialWidth });

			startResizeEndTimer({ initialWidth, finalWidth });
			return;
		}

		if (resizingState.type === 'resizing') {
			// If the state was already resizing, clear the existing timeout and start a new one.
			resizingState.abort();

			startResizeEndTimer({
				initialWidth: resizingState.initialWidth,
				finalWidth,
			});
			return;
		}
	}

	return {
		onResize,
	};
}
