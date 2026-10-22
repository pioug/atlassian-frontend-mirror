import { bindAll } from 'bind-event-listener';

type TCleanupFn = () => void;

/**
 * Calls `onChange` after any popover or dialog inside `within` opens or closes.
 * Read the new state with `hasOpenDialogOrPopover`.
 *
 * `beforetoggle`, `toggle` and `close` do not bubble, so they are observed in the capture phase.
 *
 * `toggle` and `close` are queued tasks. When a surface closes because it unmounts,
 * they fire after the element has left the DOM, so they never reach `within`.
 * `beforetoggle` fires synchronously while the element is still inside `within`,
 * so it also schedules `onChange` in a microtask, after the state has changed.
 */
export function bindOpenLayerChange({
	within,
	onChange,
}: {
	within: Element | Document;
	onChange: () => void;
}): TCleanupFn {
	let isBound = true;

	function listener() {
		onChange();
	}

	function deferredListener() {
		queueMicrotask(() => {
			if (isBound) {
				onChange();
			}
		});
	}

	const unbind = bindAll(within, [
		{ type: 'beforetoggle', listener: deferredListener, options: { capture: true } },
		{ type: 'toggle', listener, options: { capture: true } },
		{ type: 'close', listener, options: { capture: true } },
	]);

	return function cleanup() {
		isBound = false;
		unbind();
	};
}
