import { type RefObject } from 'react';

import { bindAll } from 'bind-event-listener';

import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';

import { combine } from '../internal/combine';
import { claimEscape } from '../internal/escape-ownership/claim-escape';
import { hasEscapeOwnerAbove } from '../internal/escape-ownership/has-escape-owner-above';
import { isEscapeToHandle } from '../internal/escape-ownership/is-escape-to-handle';
import { manualEscapeLayerAttribute } from '../internal/escape-ownership/manual-escape-layer-attribute';
import { useStartOpenOrderTracking } from '../internal/escape-ownership/use-start-open-order-tracking';
import { setAttribute } from '../internal/set-attribute';

/**
 * Takes each Escape meant for the open dialog and calls `onEscape` once per key press.
 *
 * The dialog has `closedby="none"`, so the browser does not close it on Escape. This hook gives it
 * the Escape a native modal `<dialog>` would get, in the same stack as `useManualLightDismiss` and
 * page surfaces (see `hasEscapeOwnerAbove`). The dialog takes the Escape unless an owner is above
 * it: a layer that takes Escape inside it, a page surface inside it, a layer that opened after it,
 * or an inner handler that called `preventDefault()`.
 *
 * A layer that does not take Escape (a `manual` popover without the hook, or a `<dialog>` that does
 * not close on Escape) is part of the dialog: Escape with focus in it closes the dialog.
 */
export function useEscapeKeydown({
	dialogRef,
	isMounted,
	onEscape,
}: {
	dialogRef: RefObject<HTMLDialogElement | null>;
	isMounted: boolean;
	onEscape: () => void;
}): undefined {
	useStartOpenOrderTracking();

	// A layout effect, so the dialog is marked and listening as soon as it opens, even from a timer
	// outside a React event.
	useLayoutEffect(() => {
		const dialog = dialogRef.current;
		if (!isMounted || !dialog) {
			return;
		}

		let shouldOwnEscapeRequest = false;
		return combine(
			// `closedby="none"` hides the dialog from other layers' checks. Mark it.
			setAttribute({ element: dialog, name: manualEscapeLayerAttribute, value: '' }),
			// Target and phase matter. See the listener order in `claim-escape`.
			bindAll(window, [
				{
					// Capture: decide while every layer is still open. An inner layer may close on this
					// keydown before the bubble listener runs.
					type: 'keydown',
					listener(event) {
						if (event.key === 'Escape') {
							shouldOwnEscapeRequest =
								dialog.open && !hasEscapeOwnerAbove({ element: dialog, isLayer: true });
						}
					},
					options: { capture: true },
				},
				{
					// Bubble: inner handlers run first.
					type: 'keydown',
					listener(event) {
						// `defaultPrevented`: an inner handler took this Escape, so one press undoes one thing (as
						// with a native `<dialog>`). Legacy ModalDialog closes anyway; the flag changes that.
						if (!isEscapeToHandle({ event }) || !shouldOwnEscapeRequest || !dialog.open) {
							return;
						}
						// `claimEscape()` stops the browser's close request. It would skip this `closedby="none"`
						// dialog and close the next close watcher (for example a parent `auto` popover), or fire
						// `cancel` without `closedby` support. A held key asks once.
						if (!claimEscape({ event })) {
							return;
						}
						onEscape();
					},
				},
			]),
		);
	}, [dialogRef, isMounted, onEscape]);
}
