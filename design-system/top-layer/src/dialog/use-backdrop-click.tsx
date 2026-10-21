import { type RefObject, useEffect } from 'react';

import { bindAll } from 'bind-event-listener';

/**
 * Calls `onBackdropClick` for a click on the backdrop of the open dialog.
 *
 * The dialog has `closedby="none"`, so the browser does not light-dismiss it. As native light
 * dismiss, the press and the release must both be on the backdrop. Browsers retarget
 * `::backdrop` events to the `<dialog>`, so the target is the dialog itself.
 *
 * Ignored:
 * - A drag from the content to the backdrop, or from the backdrop to the content.
 * - A click with no press (for example a synthetic `click()`).
 * - A press with a button other than the primary one, or a `pointercancel`.
 * - A click during the exit (the native dialog is closed).
 */
export function useBackdropClick({
	dialogRef,
	isMounted,
	onBackdropClick,
}: {
	dialogRef: RefObject<HTMLDialogElement | null>;
	isMounted: boolean;
	onBackdropClick: () => void;
}): void {
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!isMounted || !dialog) {
			return;
		}

		/**
		 * Matches native dialog light dismiss: the `pointerdown` and `pointerup` targets must match.
		 * A `click` alone is not enough, as it fires on the common ancestor of both targets.
		 * https://html.spec.whatwg.org/multipage/interactive-elements.html#dialog-light-dismiss
		 */
		let isBackdropPress = false;
		return bindAll(dialog, [
			{
				type: 'pointerdown',
				listener(event) {
					// Primary button only. `!button`: jsdom has no `PointerEvent`, so `button` is undefined.
					isBackdropPress = event.target === dialog && !event.button;
				},
			},
			{
				type: 'pointerup',
				listener(event) {
					isBackdropPress = isBackdropPress && event.target === dialog;
				},
			},
			{
				type: 'pointercancel',
				listener() {
					isBackdropPress = false;
				},
			},
			{
				type: 'click',
				listener(event) {
					// Each press is used once.
					const wasBackdropPress = isBackdropPress;
					isBackdropPress = false;
					if (!wasBackdropPress || event.target !== dialog || !dialog.open) {
						return;
					}
					onBackdropClick();
				},
			},
		]);
	}, [dialogRef, isMounted, onBackdropClick]);
}
