import { type RefObject, useEffect } from 'react';

import { bind } from 'bind-event-listener';

/**
 * Whether the browser supports the `closedby` attribute on `<dialog>`.
 *
 * Read on the client only (in an effect), so it never changes the server markup.
 */
function isClosedBySupported(): boolean {
	// eslint-disable-next-line compat/compat -- every browser in the browser policy has `<dialog>`
	return 'closedBy' in HTMLDialogElement.prototype;
}

/**
 * **Fallback for browsers without `closedby`** (Safari 27 and earlier)
 *
 * The standard path is `closedby="none"`: the browser makes no close request for the dialog, and
 * `Dialog` handles Escape and backdrop clicks itself. A browser without `closedby` ignores the
 * attribute, so a close request that `Dialog` did not take still fires `cancel` on the dialog. For
 * example: an Escape that an open child popover took (Safari also sends `cancel` to the dialog
 * then), or an Escape that an inner handler stopped with `stopPropagation()`.
 *
 * This hook refuses each of these, as `closedby="none"` would. It does not call `onClose`: in the
 * standard path these close requests do not reach the dialog either.
 *
 * In WebKit, `closedby` and the close-watcher rule ship together (one `CloseWatcherEnabled` flag),
 * so a browser without `closedby` has no forced close and every `cancel` here is cancelable.
 * If an engine sends a `cancel` that is not cancelable, the browser closes the dialog, and it runs
 * its normal close path (`onExitFinish` while `isOpen` is `true`).
 *
 * The check is a feature check, not a Safari check, so a browser starts to use the standard path
 * when it ships `closedby`. Delete this hook when every supported browser has `closedby`.
 * See notes/follow-ups/dialog-closedby.md
 */
export function useCancelFallback({
	dialogRef,
	isMounted,
}: {
	dialogRef: RefObject<HTMLDialogElement | null>;
	isMounted: boolean;
}): void {
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!isMounted || !dialog || isClosedBySupported()) {
			return;
		}
		// Native `cancel` does not bubble, so a nested dialog's `cancel` does not reach this listener.
		return bind(dialog, {
			type: 'cancel',
			listener(event) {
				event.preventDefault();
			},
		});
	}, [dialogRef, isMounted]);
}
